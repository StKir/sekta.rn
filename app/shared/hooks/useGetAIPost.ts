import { useCallback, useEffect, useRef, useState } from 'react';

import { AIPost } from '@/types/lentTypes';
import { pollForResult } from '@/shared/api/AIActions';
import { useLentStore } from '@/entities/lent/store/store';

export const useGetAIPost = (requestId: number) => {
  const { changePost, getPost } = useLentStore();
  const [post, setPost] = useState<AIPost | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const isPollingRef = useRef(false);

  const getAIPost = useCallback(
    (id: number) => {
      const foundPost = getPost(id);
      console.log('useGetAIPost: найденный пост:', foundPost);

      if (!foundPost) {
        return null;
      }

      const aiPost = foundPost.data.find(
        (item) => item.type === 'ai_text' && String(item.id) === String(id)
      ) as AIPost | undefined;

      console.log('useGetAIPost: найденный AI пост:', aiPost);
      return aiPost || null;
    },
    [getPost]
  );

  useEffect(() => {
    if (!requestId) {
      return;
    }

    console.log(`useGetAIPost: ищем пост с requestId ${requestId}`);

    const aiPost = getAIPost(requestId);
    setPost(aiPost);

    if (!aiPost) {
      console.log('useGetAIPost: AI пост не найден');
      return;
    }

    console.log(`useGetAIPost: статус поста: ${aiPost.data.status}`);

    if (aiPost.data.status === 'success' || aiPost.data.status === 'error') {
      console.log('useGetAIPost: пост уже завершен, polling не нужен');
      return;
    }

    if (aiPost.data.status === 'processing' && !isPollingRef.current) {
      console.log('useGetAIPost: начинаем polling');
      startPolling(aiPost);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, getPost]);

  const startPolling = useCallback(
    async (aiPost: AIPost) => {
      if (isPollingRef.current) {
        return;
      }

      isPollingRef.current = true;
      setIsPolling(true);
      console.log(`Начинаем polling для requestId: ${requestId}`);

      try {
        const result = await pollForResult(requestId);

        if (result.type === 'ai_text') {
          const updatedAIPost: AIPost = {
            ...aiPost,
            data: {
              result: result.result,
              status: 'success',
            },
          };

          if (updatedAIPost.data.result.includes('```json')) {
            updatedAIPost.data.result = updatedAIPost.data.result
              .replace('```json', '')
              .replace('```', '');
          }

          changePost(String(aiPost.id), updatedAIPost);

          setPost(updatedAIPost);
          console.log(`AI пост обновлен с результатом для requestId: ${requestId}`);
        }
      } catch (error) {
        console.error(`Ошибка при получении результата для requestId: ${requestId}:`, error);

        const errorAIPost: AIPost = {
          ...aiPost,
          data: {
            result: 'Произошла ошибка при получении результата',
            status: 'error',
          },
        };

        changePost(String(aiPost.id), errorAIPost);
        setPost(errorAIPost);
      } finally {
        isPollingRef.current = false;
        setIsPolling(false);
      }
    },
    [requestId, changePost]
  );

  return { post, isPolling, isError: post?.data.status === 'error' };
};
