import { Router } from "express";
import { storage } from "./storage";
import { authenticateToken, requireAdmin } from "./auth";
import { z } from "zod";

// Generic API Generator
export class APIGenerator {
  private router: Router;
  private entityName: string;
  private schema: any;
  private storage: any;

  constructor(entityName: string, schema: any, storage: any) {
    this.router = Router();
    this.entityName = entityName;
    this.schema = schema;
    this.storage = storage;
    this.generateRoutes();
  }

  private generateRoutes() {
    // GET /api/{entity} - Get all
    this.router.get(`/api/${this.entityName}`, async (req, res) => {
      try {
        const items = await this.storage[`get${this.capitalize(this.entityName)}s`]();
        res.json(items);
      } catch (error) {
        res.status(500).json({ error: `Failed to fetch ${this.entityName}s` });
      }
    });

    // GET /api/{entity}/:id - Get by ID
    this.router.get(`/api/${this.entityName}/:id`, async (req, res) => {
      try {
        const item = await this.storage[`get${this.capitalize(this.entityName)}`](req.params.id);
        if (!item) {
          return res.status(404).json({ error: `${this.capitalize(this.entityName)} not found` });
        }
        res.json(item);
      } catch (error) {
        res.status(500).json({ error: `Failed to fetch ${this.entityName}` });
      }
    });

    // POST /api/{entity} - Create
    this.router.post(`/api/${this.entityName}`, authenticateToken, requireAdmin, async (req, res) => {
      try {
        const validatedData = this.schema.parse(req.body);
        const item = await this.storage[`create${this.capitalize(this.entityName)}`](validatedData);
        res.status(201).json(item);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: "Validation failed", details: error.errors });
        }
        res.status(500).json({ error: `Failed to create ${this.entityName}` });
      }
    });

    // PUT /api/{entity}/:id - Update
    this.router.put(`/api/${this.entityName}/:id`, authenticateToken, requireAdmin, async (req, res) => {
      try {
        const validatedData = this.schema.partial().parse(req.body);
        const item = await this.storage[`update${this.capitalize(this.entityName)}`](req.params.id, validatedData);
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

    // DELETE /api/{entity}/:id - Delete
    this.router.delete(`/api/${this.entityName}/:id`, authenticateToken, requireAdmin, async (req, res) => {
      try {
        const success = await this.storage[`delete${this.capitalize(this.entityName)}`](req.params.id);
        if (!success) {
          return res.status(404).json({ error: `${this.capitalize(this.entityName)} not found` });
        }
        res.json({ message: `${this.capitalize(this.entityName)} deleted successfully` });
      } catch (error) {
        res.status(500).json({ error: `Failed to delete ${this.entityName}` });
      }
    });
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  public getRouter(): Router {
    return this.router;
  }
}

// Auto-generate APIs for all entities
export function generateAllAPIs() {
  const apis = {
    users: new APIGenerator("user", require("@shared/schema").insertUserSchema, storage),
    teams: new APIGenerator("team", require("@shared/schema").insertTeamSchema, storage),
    players: new APIGenerator("player", require("@shared/schema").insertPlayerSchema, storage),
    matches: new APIGenerator("match", require("@shared/schema").insertMatchSchema, storage),
    transfers: new APIGenerator("transfer", require("@shared/schema").insertTransferSchema, storage),
    news: new APIGenerator("news", require("@shared/schema").insertNewsSchema, storage),
    files: new APIGenerator("file", require("@shared/schema").insertFileSchema, storage),
  };

  return apis;
} 