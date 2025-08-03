import { Router } from "express";
import { storage } from "./storage";
import { authenticateToken, requireAdmin } from "./auth";
import { z } from "zod";

// Auto CRUD Generator
export class AutoCRUD {
  private router: Router;
  private entityName: string;
  private tableName: string;
  private schema: any;
  private db: any;

  constructor(entityName: string, tableName: string, schema: any, db: any) {
    this.router = Router();
    this.entityName = entityName;
    this.tableName = tableName;
    this.schema = schema;
    this.db = db;
    this.generateCRUD();
  }

  private generateCRUD() {
    // CREATE - POST /api/{entity}
    this.router.post(`/api/${this.entityName}`, authenticateToken, requireAdmin, async (req, res) => {
      try {
        const validatedData = this.schema.parse(req.body);
        const [item] = await this.db.insert(this.tableName).values(validatedData).returning();
        res.status(201).json(item);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: "Validation failed", details: error.errors });
        }
        res.status(500).json({ error: `Failed to create ${this.entityName}` });
      }
    });

    // READ ALL - GET /api/{entity}
    this.router.get(`/api/${this.entityName}`, async (req, res) => {
      try {
        const { limit = 50, offset = 0, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        let query = this.db.select().from(this.tableName);
        
        // Search functionality
        if (search && typeof search === 'string') {
          const searchableColumns = this.getSearchableColumns();
          const searchConditions = searchableColumns.map(column => 
            this.db.sql`${column} ILIKE ${`%${search}%`}`
          );
          query = query.where(this.db.or(...searchConditions));
        }
        
        // Sorting
        query = query.orderBy(this.db[sortBy as string][sortOrder as 'asc' | 'desc']());
        
        // Pagination
        query = query.limit(Number(limit)).offset(Number(offset));
        
        const items = await query;
        res.json(items);
      } catch (error) {
        res.status(500).json({ error: `Failed to fetch ${this.entityName}s` });
      }
    });

    // READ ONE - GET /api/{entity}/:id
    this.router.get(`/api/${this.entityName}/:id`, async (req, res) => {
      try {
        const [item] = await this.db.select().from(this.tableName).where(this.db.eq(this.db[this.tableName].id, req.params.id));
        if (!item) {
          return res.status(404).json({ error: `${this.capitalize(this.entityName)} not found` });
        }
        res.json(item);
      } catch (error) {
        res.status(500).json({ error: `Failed to fetch ${this.entityName}` });
      }
    });

    // UPDATE - PUT /api/{entity}/:id
    this.router.put(`/api/${this.entityName}/:id`, authenticateToken, requireAdmin, async (req, res) => {
      try {
        const validatedData = this.schema.partial().parse(req.body);
        const [item] = await this.db.update(this.tableName)
          .set({ ...validatedData, updatedAt: new Date() })
          .where(this.db.eq(this.db[this.tableName].id, req.params.id))
          .returning();
        
        if (!item) {
          return res.status(404).json({ error: `${this.capitalize(this.entityName)} not found` });
        }
        res.json(item);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: "Validation failed", details: error.errors });
        }
        res.status(500).json({ error: `Failed to update ${this.entityName}` });
      }
    });

    // DELETE - DELETE /api/{entity}/:id
    this.router.delete(`/api/${this.entityName}/:id`, authenticateToken, requireAdmin, async (req, res) => {
      try {
        const [item] = await this.db.delete(this.tableName)
          .where(this.db.eq(this.db[this.tableName].id, req.params.id))
          .returning();
        
        if (!item) {
          return res.status(404).json({ error: `${this.capitalize(this.entityName)} not found` });
        }
        res.json({ message: `${this.capitalize(this.entityName)} deleted successfully` });
      } catch (error) {
        res.status(500).json({ error: `Failed to delete ${this.entityName}` });
      }
    });

    // BULK OPERATIONS
    // Bulk Create - POST /api/{entity}/bulk
    this.router.post(`/api/${this.entityName}/bulk`, authenticateToken, requireAdmin, async (req, res) => {
      try {
        const { items } = req.body;
        if (!Array.isArray(items)) {
          return res.status(400).json({ error: "Items must be an array" });
        }

        const validatedItems = items.map(item => this.schema.parse(item));
        const createdItems = await this.db.insert(this.tableName).values(validatedItems).returning();
        res.status(201).json(createdItems);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: "Validation failed", details: error.errors });
        }
        res.status(500).json({ error: `Failed to create ${this.entityName}s` });
      }
    });

    // Bulk Delete - DELETE /api/{entity}/bulk
    this.router.delete(`/api/${this.entityName}/bulk`, authenticateToken, requireAdmin, async (req, res) => {
      try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
          return res.status(400).json({ error: "IDs must be an array" });
        }

        const deletedItems = await this.db.delete(this.tableName)
          .where(this.db.inArray(this.db[this.tableName].id, ids))
          .returning();
        
        res.json({ message: `${deletedItems.length} ${this.entityName}s deleted successfully` });
      } catch (error) {
        res.status(500).json({ error: `Failed to delete ${this.entityName}s` });
      }
    });

    // STATISTICS - GET /api/{entity}/stats
    this.router.get(`/api/${this.entityName}/stats`, async (req, res) => {
      try {
        const total = await this.db.select({ count: this.db.fn.count() }).from(this.tableName);
        const today = await this.db.select({ count: this.db.fn.count() })
          .from(this.tableName)
          .where(this.db.gte(this.db[this.tableName].createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));
        
        res.json({
          total: total[0]?.count || 0,
          today: today[0]?.count || 0,
        });
      } catch (error) {
        res.status(500).json({ error: `Failed to fetch ${this.entityName} statistics` });
      }
    });
  }

  private getSearchableColumns(): string[] {
    // Define searchable columns for each entity
    const searchableColumns: { [key: string]: string[] } = {
      users: ['username', 'email', 'firstName', 'lastName'],
      teams: ['name', 'city', 'stadium'],
      players: ['name', 'position', 'nationality'],
      matches: ['homeTeam', 'awayTeam', 'competition'],
      transfers: ['playerName', 'fromTeam', 'toTeam'],
      news: ['title', 'content', 'category'],
      files: ['filename', 'originalName'],
    };

    return searchableColumns[this.entityName] || ['id'];
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Auto-generate CRUD for all entities
export function generateAllCRUD(db: any) {
  const { 
    insertUserSchema, 
    insertTeamSchema, 
    insertPlayerSchema, 
    insertMatchSchema, 
    insertTransferSchema, 
    insertNewsSchema, 
    insertFileSchema 
  } = require("@shared/schema");

  const crudApis = {
    users: new AutoCRUD("users", "users", insertUserSchema, db),
    teams: new AutoCRUD("teams", "teams", insertTeamSchema, db),
    players: new AutoCRUD("players", "players", insertPlayerSchema, db),
    matches: new AutoCRUD("matches", "matches", insertMatchSchema, db),
    transfers: new AutoCRUD("transfers", "transfers", insertTransferSchema, db),
    news: new AutoCRUD("news", "news", insertNewsSchema, db),
    files: new AutoCRUD("files", "files", insertFileSchema, db),
  };

  return crudApis;
} 