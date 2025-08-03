import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMatchSchema, insertTransferSchema, insertNewsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for live updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'subscribe') {
          // Handle subscription to specific events
          console.log('Client subscribed to:', data.events);
        }
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Broadcast live updates to all connected clients
  const broadcastUpdate = (type: string, data: any) => {
    const message = JSON.stringify({ type, data });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Teams API
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  // Players API
  app.get("/api/players", async (req, res) => {
    try {
      const players = await storage.getPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch players" });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const player = await storage.getPlayer(req.params.id);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch player" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const newsItem = await storage.getNews(req.params.id);
      if (!newsItem) {
        return res.status(404).json({ message: "News not found" });
      }
      // Increment views
      await storage.incrementNewsViews(req.params.id);
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get("/api/teams/:id/players", async (req, res) => {
    try {
      const players = await storage.getPlayersByTeam(req.params.id);
      res.json(players);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team players" });
    }
  });

  // Matches API
  app.get("/api/matches/today", async (req, res) => {
    try {
      const matches = await storage.getTodayMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's matches" });
    }
  });

  app.get("/api/matches/live", async (req, res) => {
    try {
      const matches = await storage.getLiveMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live matches" });
    }
  });

  app.get("/api/matches/upcoming", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const matches = await storage.getUpcomingMatches(limit);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming matches" });
    }
  });

  app.get("/api/matches/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const matches = await storage.getRecentMatches(limit);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent matches" });
    }
  });

  app.get("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.getMatch(req.params.id);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch match" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const matchData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(matchData);
      res.status(201).json(match);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid match data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create match" });
    }
  });

  app.patch("/api/matches/:id/score", async (req, res) => {
    try {
      const { homeScore, awayScore, currentTime } = req.body;
      await storage.updateMatchScore(req.params.id, homeScore, awayScore, currentTime);
      
      // Broadcast live score update
      broadcastUpdate('scoreUpdate', {
        matchId: req.params.id,
        homeScore,
        awayScore,
        currentTime
      });
      
      res.json({ message: "Score updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update match score" });
    }
  });

  app.patch("/api/matches/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateMatchStatus(req.params.id, status);
      
      // Broadcast status update
      broadcastUpdate('statusUpdate', {
        matchId: req.params.id,
        status
      });
      
      res.json({ message: "Match status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update match status" });
    }
  });

  // Transfers API
  app.get("/api/transfers/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const transfers = await storage.getRecentTransfers(limit);
      res.json(transfers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent transfers" });
    }
  });

  app.get("/api/transfers/status/:status", async (req, res) => {
    try {
      const transfers = await storage.getTransfersByStatus(req.params.status);
      res.json(transfers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transfers by status" });
    }
  });

  app.post("/api/transfers", async (req, res) => {
    try {
      const transferData = insertTransferSchema.parse(req.body);
      const transfer = await storage.createTransfer(transferData);
      
      // Broadcast new transfer
      broadcastUpdate('newTransfer', transfer);
      
      res.status(201).json(transfer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transfer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transfer" });
    }
  });

  // News API
  app.get("/api/news/breaking", async (req, res) => {
    try {
      const news = await storage.getBreakingNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch breaking news" });
    }
  });

  app.get("/api/news/latest", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const news = await storage.getLatestNews(limit);
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest news" });
    }
  });

  app.get("/api/news/featured", async (req, res) => {
    try {
      const news = await storage.getFeaturedNews();
      if (!news) {
        return res.status(404).json({ message: "No featured news found" });
      }
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured news" });
    }
  });

  app.get("/api/news/category/:category", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const news = await storage.getNewsByCategory(req.params.category, limit);
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news by category" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(newsData);
      
      // Broadcast breaking news
      if (news.isBreaking) {
        broadcastUpdate('breakingNews', news);
      }
      
      res.status(201).json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid news data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create news" });
    }
  });

  app.patch("/api/news/:id/views", async (req, res) => {
    try {
      await storage.incrementNewsViews(req.params.id);
      res.json({ message: "Views incremented successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to increment news views" });
    }
  });

  return httpServer;
}
