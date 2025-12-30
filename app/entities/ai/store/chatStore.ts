import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

import { StorageService } from '@/shared/utils/storage';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: Array<{
    type: 'text';
    text: string;
  }>;
  id: string;
  timestamp: number;
  status?: 'processing' | 'success' | 'error';
  requestId?: number;
};

interface ChatState {
  messages: ChatMessage[];
}

interface ChatActions {
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  getLastMessages: (count: number) => ChatMessage[];
}

type ChatStore = ChatState & ChatActions;

const STORAGE_KEY = 'ai_chat_messages';
const MAX_MESSAGES = 10;

const getMessagesFromStorage = (): ChatMessage[] => {
  try {
    const stored = StorageService.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch {
    return [];
  }
};

const saveMessagesToStorage = (messages: ChatMessage[]) => {
  try {
    const limitedMessages = messages.slice(-MAX_MESSAGES);
    StorageService.setItem(STORAGE_KEY, JSON.stringify(limitedMessages));
  } catch (error) {
    console.error('Error saving chat messages:', error);
  }
};

export const useChatStore = create<ChatStore>()(
  persist(
    (setState, get) => ({
      messages: getMessagesFromStorage(),

      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
        };

        setState((state) => {
          const updatedMessages = [...state.messages, newMessage].slice(-MAX_MESSAGES);
          saveMessagesToStorage(updatedMessages);
          return { messages: updatedMessages };
        });

        return newMessage.id;
      },

      updateMessage: (id, updates) => {
        setState((state) => {
          const updatedMessages = state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          );
          saveMessagesToStorage(updatedMessages);
          return { messages: updatedMessages };
        });
      },

      clearMessages: () => {
        setState({ messages: [] });
        StorageService.removeItem(STORAGE_KEY);
      },

      getLastMessages: (count) => {
        const messages = get().messages;
        return messages.slice(-count);
      },
    }),
    {
      name: 'ai-chat-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => StorageService.getItem(name) ?? null,
        setItem: (name: string, value: string) => StorageService.setItem(name, value),
        removeItem: (name: string) => StorageService.removeItem(name),
      })),
    }
  )
);
