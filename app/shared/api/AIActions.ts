import axios from 'axios';

import { StorageService } from '../utils';

import { AIModel, AIModelResponseFormat } from '@/types/aiTypes';
import { GEN_API_TOKEN, GEN_API_URL } from '@/env';

export async function sendToAI(
  prompt: string,
  response_format: AIModelResponseFormat = AIModelResponseFormat.TEXT
): Promise<number> {
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
    response_format: response_format,
    n: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    temperature: 1,
    top_p: 1,
  };

  console.log('==== Отправляемый промпт ====');
  console.log(payload.messages[0].content[0].text);
  console.log('=============================');
  const selectedAIModel = StorageService.getSelectedAIModel() || AIModel.GPT_4_1;
  console.log(selectedAIModel);

  try {
    const initialResponse = await axios.post<GPTResponseInitial>(
      `${GEN_API_URL}/networks/${selectedAIModel}`,
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

    if (initialResponse.data.status === 'error') {
      throw new Error('Ошибка при отправке запроса');
    }

    return initialResponse.data.request_id;
  } catch (error) {
    console.error('Ошибка в работе с GPT API:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function sendChatMessage(
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: Array<{
      type: 'text';
      text: string;
    }>;
  }>,
  response_format: AIModelResponseFormat = AIModelResponseFormat.TEXT
): Promise<number> {
  const payload: GPTRequest = {
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content.map((c) => ({
        type: c.type,
        text: c.type === 'text' ? minifyText(c.text) : c.text,
      })),
    })),
    response_format: response_format,
    n: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    temperature: 1,
    top_p: 1,
  };

  const selectedAIModel = AIModel.GEMINI_2_5_FLASH_LITE;

  try {
    const initialResponse = await axios.post<GPTResponseInitial>(
      `${GEN_API_URL}/networks/${selectedAIModel}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GEN_API_TOKEN}`,
        },
      }
    );

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
  const delayMs = 4000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    if (attempts !== 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    attempts++;

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
        const text = getCurrentText(statusResponse.data.result?.[0] as any);
        console.log(text);

        return {
          result: text || '',
          requestId,
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
      if (attempts === maxAttempts) {
        throw error;
      }
    }
  }

  throw new Error('Превышено максимальное количество попыток получения результата');
};

export const pollForResultWithCallback = async (
  requestId: number,
  onUpdate: (status: 'processing' | 'starting' | 'success' | 'error', result?: string) => void
): Promise<GPTResponseResult> => {
  const maxAttempts = 60;
  const delayMs = 2000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    if (attempts !== 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    attempts++;

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
        const text = getCurrentText(statusResponse.data.result?.[0] as any);
        onUpdate('success', text || '');
        return {
          result: text || '',
          requestId,
          type: 'ai_text',
        };
      }

      if (statusResponse.data.status === 'error') {
        onUpdate('error');
        throw new Error('Ошибка при обработке запроса');
      }

      if (
        statusResponse.data.status === 'processing' ||
        statusResponse.data.status === 'starting'
      ) {
        onUpdate(statusResponse.data.status);
        continue;
      }
    } catch (error) {
      if (attempts === maxAttempts) {
        onUpdate('error');
        throw error;
      }
    }
  }

  onUpdate('error');
  throw new Error('Превышено максимальное количество попыток получения результата');
};

function minifyText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s([.,!?;:])/g, '$1')
    .trim();
}

const getCurrentText = (initialRes: any) => {
  if (!initialRes) {
    return '';
  }

  if ('message' in initialRes) {
    return initialRes.message.content;
  }

  if ('choices' in initialRes) {
    return initialRes.choices[0].message.content;
  }

  return initialRes.result;
};

interface GPTRequest {
  response_format?: AIModelResponseFormat;
  n?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  temperature?: number;
  top_p?: number;
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
