import axios from 'axios';

import { GEN_API_TOKEN, GEN_API_URL } from '@/env';

export async function sendToGPT(prompt: string, model: string = 'gpt-4-1'): Promise<number> {
  const payload: GPTRequest = {
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: minifyText(prompt),
          },
        ],
      },
    ],
  };

  console.log('==== Отправляемый промпт ====');
  console.log(payload.messages[0].content[0].text);
  console.log('=============================');

  try {
    const initialResponse = await axios.post<GPTResponseInitial>(
      `${GEN_API_URL}/networks/${model}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GEN_API_TOKEN}`,
        },
      }
    );

    console.log('==== Первоначальный ответ ====');
    console.log(initialResponse.data);
    console.log('=============================');

    const requestId = initialResponse.data.request_id;
    console.log('Request ID:', requestId);

    if (initialResponse.data.status === 'error') {
      throw new Error('Ошибка при отправке запроса');
    }

    return initialResponse.data.request_id;
  } catch (error) {
    console.error('Ошибка в работе с GPT API:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export const pollForResult = async (requestId: number): Promise<GPTResponseResult> => {
  const maxAttempts = 30;
  const delayMs = 10000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    if (attempts !== 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    console.log(attempts);
    attempts++;

    console.log(`Попытка ${attempts}/${maxAttempts} получения результата`);

    try {
      const statusResponse = await axios.get<GPTResponse>(
        `${GEN_API_URL}/request/get/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${GEN_API_TOKEN}`,
          },
        }
      );

      if (statusResponse.data.status === 'success') {
        return {
          result: statusResponse.data.result?.[0] || '',
          requestId: statusResponse.data.request_id,
          type: 'ai_text',
        };
      }

      if (statusResponse.data.status === 'error') {
        throw new Error('Ошибка при обработке запроса');
      }

      if (
        statusResponse.data.status === 'processing' ||
        statusResponse.data.status === 'starting'
      ) {
        continue;
      }
    } catch (error) {
      console.error(`Ошибка при получении статуса (попытка ${attempts}):`, error);
      if (attempts === maxAttempts) {
        throw error;
      }
    }
  }

  throw new Error('Превышено максимальное количество попыток получения результата');
};

// Вспомогательная функция для минификации
function minifyText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s([.,!?;:])/g, '$1')
    .trim();
}

// Типы для TypeScript
interface GPTRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: Array<{
      type: 'text';
      text: string;
    }>;
  }>;
}

interface GPTResponseInitial {
  request_id: number;
  model: string;
  status: 'starting' | 'success' | 'error' | 'processing';
}

interface GPTResponse {
  request_id: number;
  status: 'starting' | 'success' | 'error' | 'processing';
  input?: any;
  result?: string[];
  response_type?: 'string' | 'json';
}

interface GPTResponseResult {
  result: string | any;
  requestId: number;
  type: 'ai_text' | 'question' | 'error';
}
