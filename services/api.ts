
import { User, Transaction, UserCredentials } from '../types';

// --- MOCK DATABASE ---
// In a real app, this would be a MongoDB/Postgres database on a server.
// We use localStorage here to PERSIST the simulation across refreshes,
// but the architecture is designed as an async API service.

const DB_KEY_USERS = 'geohop_db_users';
const DB_KEY_TXS = 'geohop_db_txs';

interface DBUser extends User {
  passwordHash: string; // Simulating security
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class GeoHopService {
  private users: Map<string, DBUser>;
  private transactions: Transaction[];

  constructor() {
    this.users = new Map();
    this.transactions = [];
    this.loadFromStorage();
    
    // Create Default Admin if not exists
    if (!this.users.has('admin')) {
        this.createAdminAccount();
    }
  }

  private loadFromStorage() {
    try {
      const u = localStorage.getItem(DB_KEY_USERS);
      const t = localStorage.getItem(DB_KEY_TXS);
      
      if (u) {
        const parsedUsers = JSON.parse(u);
        // Rehydrate Map
        Object.values(parsedUsers).forEach((user: any) => {
            this.users.set(user.username, user);
        });
      }
      if (t) this.transactions = JSON.parse(t);
    } catch (e) {
      console.error("Database corruption detected. Resetting...", e);
    }
  }

  private save() {
    // Persist to "Disk"
    const userObj = Object.fromEntries(this.users);
    localStorage.setItem(DB_KEY_USERS, JSON.stringify(userObj));
    localStorage.setItem(DB_KEY_TXS, JSON.stringify(this.transactions));
  }

  private createAdminAccount() {
    const admin: DBUser = {
        id: 'admin-001',
        username: 'admin',
        passwordHash: 'admin123', // Simple for demo
        callsign: 'OVERLORD',
        balance: 999999999,
        nodeId: '!ADMIN_ROOT',
        joinedAt: new Date().toISOString(),
        highestBalance: 999999999,
        role: 'admin'
    };
    this.users.set('admin', admin);
    this.save();
  }

  // --- PUBLIC API METHODS ---

  async login(creds: UserCredentials): Promise<User> {
    await delay(800); // Network latency simulation
    
    const user = this.users.get(creds.username);
    if (!user) throw new Error("User not found.");
    if (user.passwordHash !== creds.password) throw new Error("Invalid credentials.");
    if (user.isBanned) throw new Error("This node has been banned from the network.");

    // Return sanitized user (no password)
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async register(creds: UserCredentials): Promise<User> {
    await delay(1200);

    if (this.users.has(creds.username)) {
        throw new Error("Callsign already registered.");
    }

    const newUser: DBUser = {
        id: `user-${Date.now()}`,
        username: creds.username,
        passwordHash: creds.password,
        callsign: creds.username.toUpperCase(),
        balance: 0.0000,
        nodeId: `!${Math.random().toString(16).substr(2, 6)}`,
        joinedAt: new Date().toISOString(),
        highestBalance: 0,
        role: 'user'
    };

    this.users.set(creds.username, newUser);
    this.save();

    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  async getUser(username: string): Promise<User | null> {
      await delay(200);
      const u = this.users.get(username);
      if (!u) return null;
      const { passwordHash, ...safeUser } = u;
      return safeUser;
  }

  async getTransactions(username: string): Promise<Transaction[]> {
      // In a real blockchain, you might sync the whole chain, 
      // but here we filter for the user's relevant txs.
      // Admin sees all.
      await delay(300);
      const user = this.users.get(username);
      if (user?.role === 'admin') return [...this.transactions].reverse();

      return this.transactions.filter(t => 
        // For simulation, we assume transaction ID or metadata links to user, 
        // or we just rely on local state in the simplified version.
        // Let's implement a simple owner check if we stored it, 
        // but currently transactions are stored globally.
        // We will return global transactions for the "mesh" vibe, 
        // or filter if we added ownerId to Tx.
        // For now, let's just return the global list for the "Public Ledger" feel,
        // or filtered if I add owner fields.
        true 
      ).reverse(); 
  }

  async sendFunds(fromUsername: string, toNodeId: string, amount: number): Promise<Transaction> {
      await delay(1000);
      
      const sender = this.users.get(fromUsername);
      if (!sender) throw new Error("Sender authentication failed.");
      if (sender.balance < amount) throw new Error("Insufficient funds.");

      // Find recipient by NodeID
      const recipientEntry = Array.from(this.users.values()).find(u => u.nodeId === toNodeId);
      if (!recipientEntry) throw new Error("Recipient node not found on the mesh.");

      // Execute Tx
      sender.balance -= amount;
      recipientEntry.balance += amount;

      if (recipientEntry.balance > recipientEntry.highestBalance) {
          recipientEntry.highestBalance = recipientEntry.balance;
      }

      const tx: Transaction = {
          id: `tx-${Date.now()}`,
          type: 'send',
          amount,
          peerId: recipientEntry.callsign,
          timestamp: new Date().toISOString(),
          status: 'completed'
      };

      this.transactions.push(tx);
      this.save();
      return tx;
  }

  async mineReward(username: string, amount: number): Promise<Transaction> {
      // No delay for mining to keep UI snappy
      const user = this.users.get(username);
      if (!user) throw new Error("User not found");

      user.balance += amount;
      if (user.balance > user.highestBalance) {
          user.highestBalance = user.balance;
      }

      const tx: Transaction = {
          id: `mine-${Date.now()}`,
          type: 'mine',
          amount,
          timestamp: new Date().toISOString(),
          status: 'completed'
      };
      
      // We don't necessarily push every tiny mine tx to global history to save space,
      // but for this app we will.
      this.transactions.push(tx);
      this.save();
      return tx;
  }

  // --- ADMIN FUNCTIONS ---
  
  async getAllUsers(): Promise<User[]> {
      await delay(500);
      return Array.from(this.users.values()).map(u => {
          const { passwordHash, ...safe } = u;
          return safe;
      });
  }

  async adminUpdateBalance(targetUsername: string, newBalance: number): Promise<void> {
      await delay(600);
      const u = this.users.get(targetUsername);
      if (!u) throw new Error("User not found");
      u.balance = newBalance;
      this.save();
  }

  async adminDeleteUser(targetUsername: string): Promise<void> {
    await delay(600);
    if (targetUsername === 'admin') throw new Error("Cannot delete root admin.");
    this.users.delete(targetUsername);
    this.save();
  }
}

export const api = new GeoHopService();
