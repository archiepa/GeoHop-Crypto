
export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'mine' | 'admin_adjust';
  amount: number;
  timestamp: string;
  peerId?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface User {
  id: string;
  username: string;
  callsign: string; // Meshtastic vibe
  balance: number;
  nodeId: string;
  joinedAt: string;
  highestBalance: number;
  role: 'user' | 'admin';
  isBanned?: boolean;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  ADMIN = 'ADMIN'
}
