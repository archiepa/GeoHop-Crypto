import { User, Transaction, UserCredentials } from '../types';

// Points to the PHP file in the same directory (root of dist/)
// When running in Vite Dev mode, you might need to proxy this or run the PHP server separately.
const API_ENDPOINT = './api.php';

class GeoHopService {

  private async request(action: string, method: 'GET' | 'POST' = 'GET', body?: any) {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    let url = `${API_ENDPOINT}?action=${action}`;
    // For GET requests with params, we'd append them to URL, but our simple PHP handles POST body well for args
    // except for simple lookups which we handle below in specific methods.

    try {
      const res = await fetch(url, options);
      const text = await res.text();
      
      try {
        const json = JSON.parse(text);
        if (!res.ok) {
          throw new Error(json.error || 'Server Error');
        }
        return json;
      } catch (e) {
        // If JSON parse fails, it might be a PHP error or 404
        console.error("Raw Server Response:", text);
        throw new Error("Invalid response from XAMPP server. Make sure api.php is running.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      throw error;
    }
  }

  async login(creds: UserCredentials): Promise<User> {
    return this.request('login', 'POST', creds);
  }

  async register(creds: UserCredentials): Promise<User> {
    return this.request('register', 'POST', creds);
  }

  async getUser(username: string): Promise<User | null> {
    // Append query param for GET
    const res = await fetch(`${API_ENDPOINT}?action=getUser&username=${username}`);
    if (!res.ok) return null;
    return await res.json();
  }

  async getTransactions(username: string): Promise<Transaction[]> {
    const res = await fetch(`${API_ENDPOINT}?action=getTransactions&username=${username}`);
    if (!res.ok) return [];
    return await res.json();
  }

  async sendFunds(fromUsername: string, toNodeId: string, amount: number): Promise<Transaction> {
    return this.request('sendFunds', 'POST', {
      from: fromUsername,
      toNodeId,
      amount
    });
  }

  async mineReward(username: string, amount: number): Promise<Transaction> {
    return this.request('mine', 'POST', {
      username,
      amount
    });
  }

  // --- ADMIN FUNCTIONS ---
  
  async getAllUsers(): Promise<User[]> {
    const res = await fetch(`${API_ENDPOINT}?action=getAllUsers`);
    if (!res.ok) return [];
    return await res.json();
  }

  async adminUpdateBalance(targetUsername: string, newBalance: number): Promise<void> {
    await this.request('adminUpdate', 'POST', {
      username: targetUsername,
      balance: newBalance
    });
  }

  async adminDeleteUser(targetUsername: string): Promise<void> {
    await this.request('adminDelete', 'POST', { username: targetUsername });
  }
}

export const api = new GeoHopService();