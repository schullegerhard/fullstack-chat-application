import { users, type User, type InsertUser, identities, type Identity, type InsertIdentity } from "@shared/schema";
import { DEFAULT_BADGES } from "../client/src/lib/constants";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Identity related methods
  getIdentity(address: string): Promise<Identity | undefined>;
  createIdentity(identity: InsertIdentity): Promise<Identity>;
  updateIdentity(address: string, identity: Partial<InsertIdentity>): Promise<Identity | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private identities: Map<string, Identity>;
  userCurrentId: number;
  identityCurrentId: number;

  constructor() {
    this.users = new Map();
    this.identities = new Map();
    this.userCurrentId = 1;
    this.identityCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getIdentity(address: string): Promise<Identity | undefined> {
    return this.identities.get(address.toLowerCase());
  }

  async createIdentity(insertIdentity: InsertIdentity): Promise<Identity> {
    const id = this.identityCurrentId++;
    const address = insertIdentity.address.toLowerCase();
    const now = new Date();
    
    const identity: Identity = {
      ...insertIdentity,
      id,
      address,
      firstActive: insertIdentity.firstActive || now,
      badges: insertIdentity.badges || DEFAULT_BADGES,
    };
    
    this.identities.set(address, identity);
    return identity;
  }

  async updateIdentity(address: string, updateData: Partial<InsertIdentity>): Promise<Identity | undefined> {
    const normalizedAddress = address.toLowerCase();
    const existingIdentity = this.identities.get(normalizedAddress);
    
    if (!existingIdentity) {
      return undefined;
    }
    
    const updatedIdentity: Identity = {
      ...existingIdentity,
      ...updateData,
      address: normalizedAddress,
    };
    
    this.identities.set(normalizedAddress, updatedIdentity);
    return updatedIdentity;
  }
}

export const storage = new MemStorage();
