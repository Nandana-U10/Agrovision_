import apiClient from './client';
import type { ChatbotRequest, ChatbotResponse } from '../types/api';

export async function sendChatMessage(payload: ChatbotRequest): Promise<ChatbotResponse> {
  const response = await apiClient.post<ChatbotResponse>('/api/v1/chatbot/query', payload);
  return response.data;
}
