import { useEffect } from "react";
import { wsService } from "../services/websocketService";
import { useAuthStore } from "../stores/authStore";

export const useWebSocket = () => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Connect WebSocket
      wsService.connect();

      // Cleanup on unmount or logout
      return () => {
        wsService.disconnect();
      };
    }
  }, [isAuthenticated]);

  return {
    subscribeToConversation: wsService.subscribeToConversation.bind(wsService),
    unsubscribeFromConversation:
      wsService.unsubscribeFromConversation.bind(wsService),
    sendMessage: wsService.sendMessage.bind(wsService),
    isConnected: wsService.isConnected.bind(wsService),
  };
};
