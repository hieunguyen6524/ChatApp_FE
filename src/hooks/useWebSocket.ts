import { useEffect } from "react";
import { wsService } from "../services/websocketService";
import { useAuthStore } from "../stores/authStore";

export const useWebSocket = () => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Establish connection once; guarded internally to avoid duplicates
      wsService.connect();
    } else {
      // Disconnect when user logs out
      wsService.disconnect();
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
