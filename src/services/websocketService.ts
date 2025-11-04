/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuthStore } from "../stores/authStore";
import { useChatStore } from "../stores/chatStore";
import type { Message } from "@/types/message.types";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8080";

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<number, any> = new Map();
  private desiredConversationIds: Set<number> = new Set();

  connect() {
    const token = useAuthStore.getState().accessToken;

    if (!token) {
      console.error("No access token available for WebSocket");
      return;
    }

    // Create STOMP client với SockJS
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${WS_URL}/ws`),

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      debug: (str) => {
        console.log("STOMP Debug:", str);
      },

      onConnect: () => {
        console.log("✅ WebSocket Connected");
        this.onConnected();
      },

      onDisconnect: () => {
        console.log("❌ WebSocket Disconnected");
      },

      onStompError: (frame) => {
        console.error("STOMP Error:", frame);
      },

      // Reconnect
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.activate();
  }

  private onConnected() {
    console.log("WebSocket connected, ready to subscribe");
    // Re-subscribe to desired conversations after reconnect
    this.desiredConversationIds.forEach((conversationId) => {
      try {
        // Clean any stale entry
        const existing = this.subscriptions.get(conversationId);
        if (existing) {
          try { existing.unsubscribe(); } catch {}
          this.subscriptions.delete(conversationId);
        }
        const subscription = this.client!.subscribe(
          `/topic/conversations/${conversationId}`,
          (message: IMessage) => {
            this.handleMessage(message);
          }
        );
        this.subscriptions.set(conversationId, subscription);
        console.log(`🔁 Re-subscribed to conversation ${conversationId}`);
      } catch (e) {
        console.error("Failed to resubscribe:", conversationId, e);
      }
    });
  }

  // Subscribe to conversation
  subscribeToConversation(conversationId: number) {
    this.desiredConversationIds.add(conversationId);

    if (!this.client?.connected) {
      console.warn("WebSocket not connected, attempting to connect and will subscribe after connect");
      this.connect();
      return;
    }

    // Kiểm tra đã subscribe chưa
    if (this.subscriptions.has(conversationId)) {
      console.log(`Already subscribed to conversation ${conversationId}`);
      return;
    }

    const subscription = this.client.subscribe(
      `/topic/conversations/${conversationId}`,
      (message: IMessage) => {
        this.handleMessage(message);
      }
    );

    this.subscriptions.set(conversationId, subscription);
    console.log(`✅ Subscribed to conversation ${conversationId}`);
  }

  // Unsubscribe from conversation
  unsubscribeFromConversation(conversationId: number) {
    const subscription = this.subscriptions.get(conversationId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(conversationId);
      console.log(`❌ Unsubscribed from conversation ${conversationId}`);
    }
    this.desiredConversationIds.delete(conversationId);
  }

  // Send message
  sendMessage(
    conversationId: number,
    content: string,
    contentType: string = "TEXT",
    parentId?: number
  ) {
    if (!this.client?.connected) {
      console.error("WebSocket not connected");
      return Promise.reject(new Error("WebSocket not connected"));
    }

    return new Promise((resolve, reject) => {
      try {
        this.client!.publish({
          destination: `/app/chat/${conversationId}`,
          body: JSON.stringify({
            conversationId,
            content,
            contentType,
            parentId: parentId || null,
          }),
        });

        console.log(`📤 Message sent to conversation ${conversationId}`);
        resolve(true);
      } catch (error) {
        console.error("Failed to send message:", error);
        reject(error);
      }
    });
  }

  // Handle incoming message
  private handleMessage(message: IMessage) {
    try {
      const parsed = JSON.parse(message.body);
      // Accept either wrapped or raw message payloads
      const payload: Message = (parsed && parsed.data) ? parsed.data : parsed;
      console.log("📥 Received message:", payload);

      // Update Zustand store
      const { addMessage } = useChatStore.getState();
      addMessage(payload);
    } catch (error) {
      console.error("Failed to handle message:", error);
    }
  }

  disconnect() {
    if (this.client) {
      // Unsubscribe all
      this.subscriptions.forEach((sub) => sub.unsubscribe());
      this.subscriptions.clear();

      this.client.deactivate();
      this.client = null;
      console.log("WebSocket disconnected");
    }
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

export const wsService = new WebSocketService();
