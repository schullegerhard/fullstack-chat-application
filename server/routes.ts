import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIdentitySchema } from "@shared/schema";
import { generateRandomHash } from "../client/src/lib/utils";
import { DEFAULT_BADGES } from "../client/src/lib/constants";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get identity by address
  app.get("/api/identity/:address", async (req, res) => {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ message: "Address is required" });
      }

      const identity = await storage.getIdentity(address);
      
      if (!identity) {
        return res.status(404).json({ message: "Identity not found" });
      }
      
      return res.json(identity);
    } catch (error) {
      console.error("Error getting identity:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create or update identity
  app.post("/api/identity", async (req, res) => {
    try {
      const identityData = req.body;
      
      // Validate request body
      const validationResult = insertIdentitySchema.safeParse(identityData);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid identity data",
          errors: validationResult.error.errors 
        });
      }
      
      const { address } = identityData;
      const existingIdentity = await storage.getIdentity(address);
      
      if (existingIdentity) {
        // Update existing identity
        const updatedIdentity = await storage.updateIdentity(address, identityData);
        return res.json(updatedIdentity);
      } else {
        // Create new identity with default values for missing fields
        const newIdentity = await storage.createIdentity({
          ...identityData,
          hash: identityData.hash || generateRandomHash(),
          name: identityData.name || "CryptoExplorer",
          badges: identityData.badges || DEFAULT_BADGES,
          firstActive: new Date()
        });
        
        return res.status(201).json(newIdentity);
      }
    } catch (error) {
      console.error("Error creating/updating identity:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Simulate cross-chain identity fetch
  app.post("/api/identity/import", async (req, res) => {
    try {
      const { sourceChain, sourceAddress, identityType } = req.body;
      
      if (!sourceChain || !sourceAddress || !identityType) {
        return res.status(400).json({ message: "sourceChain, sourceAddress, and identityType are required" });
      }
      
      // In a real implementation, we would fetch data from the source chain
      // For now, just return simulated data
      
      return res.json({
        type: identityType,
        name: `${sourceChain} ${identityType}`,
        source: sourceChain
      });
    } catch (error) {
      console.error("Error importing identity:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
