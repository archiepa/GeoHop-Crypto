
export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'mine';
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
  DASHBOARD = 'DASHBOARD'
}
