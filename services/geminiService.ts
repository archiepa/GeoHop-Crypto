import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
You are GeoBot, the specialized AI assistant for GeoHop, a decentralized cryptocurrency that operates on the Meshtastic mesh network protocol.
Your tone should be helpful, technical but accessible, and slightly "cyberpunk" or "radio-operator" themed.

Key GeoHop Concepts:
- GeoHop relies on "Proof of Coverage" via LoRa radios.
- Transactions are gossiped across the mesh using LoRa 915MHz/433MHz.
- **Mining**: Users can "Mine" by toggling the "Start Mining" switch in their dashboard. This turns their node into a relay. They earn HOP rewards for verifying coverage and relaying packets.
- **Receiving**: To receive funds, users must share their Node ID (available in the "Receive" tab) or show their QR code.
- The currency symbol is HOP.

If users ask about account balances or specific transactions, remind them you are a general assistant and they should check their dashboard for real-time data, but you can explain *how* to read the dashboard.
`;

export const initChatSession = (): void => {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing.");
    return;
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initChatSession();
    if (!chatSession) return "Transceiver offline. Check API configuration.";
  }

  try {
    const response = await chatSession!.sendMessage({ message });
    return response.text || "Signal received, but payload was empty.";
  } catch (error) {
    console.error("Gemini communication error:", error);
    return "Interference detected. Unable to reach the mesh intelligence.";
  }
};