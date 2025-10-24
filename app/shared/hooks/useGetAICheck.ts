import { useCallback, useEffect, useRef, useState } from 'react';

import { AiResult } from '@/types/lentTypes';
import { pollForResult } from '@/shared/api/AIActions';
import { useLentStore } from '@/entities/lent/store/store';

export const useGetAICheck = (requestId: number) => {
  const { updateAiData, aiData } = useLentStore();
  const [post, setPost] = useState<AiResult | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const isPollingRef = useRef(false);

  const getAIPost = useCallback(
    (id: number) => {
      console.log('getAIPost: ищем requestId:', id);
      console.log('getAIPost: текущий aiData:', aiData);
      const foundPost = aiData.find((item) => item.requestId === id);
      console.log('getAIPost: найденный пост:', foundPost);

      if (!foundPost) {
        return null;
      }

      return foundPost || null;
    },
    [aiData]
  );

  useEffect(() => {
    console.log(requestId);

    if (!requestId) {
      return;
    }

    console.log(`useGetAIPost: ищем пост с requestId ${requestId}`);

    const aiPost = getAIPost(requestId);
    console.log(aiPost);

    setPost(aiPost);

    if (!aiPost) {
      return;
    }

    console.log(`useGetAIPost: статус поста: ${aiPost.status}`);

    if (aiPost.status === 'success' || aiPost.status === 'error') {
      console.log('useGetAIPost: пост уже завершен, polling не нужен');
      return;
    }

    if (aiPost.status === 'processing' && !isPollingRef.current) {
      console.log('useGetAIPost: начинаем polling');
      startPolling(aiPost);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, aiData]);

  const startPolling = useCallback(
    async (aiPost: AiResult) => {
      if (isPollingRef.current) {
        return;
      }

      isPollingRef.current = true;
      setIsPolling(true);
      console.log(`Начинаем polling для requestId: ${requestId}`);

      try {
        const result = await pollForResult(requestId);

        if (result.type === 'ai_text') {
          const updatedAIPost: AiResult = {
            ...aiPost,
            result: result.result,
            status: 'success',
          };

          console.log('startPolling: обновляем aiPost с postId:', aiPost.postId);
          console.log('startPolling: обновленные данные:', updatedAIPost);
          updateAiData(String(aiPost.postId), updatedAIPost);
          setPost(updatedAIPost);
          console.log(`AI пост обновлен с результатом для requestId: ${requestId}`);
        }
      } catch (error) {
        console.error(`Ошибка при получении результата для requestId: ${requestId}:`, error);

        const errorAIPost: AiResult = {
          ...aiPost,
          result: 'Произошла ошибка при получении результата',
          status: 'error',
        };

        console.log('startPolling: обновляем aiPost с ошибкой, postId:', aiPost.postId);
        console.log('startPolling: данные с ошибкой:', errorAIPost);
        updateAiData(String(aiPost.postId), errorAIPost);
        setPost(errorAIPost);
      } finally {
        isPollingRef.current = false;
        setIsPolling(false);
      }
    },
    [requestId, updateAiData]
  );

  return { post, isPolling, isError: post?.status === 'error' };
};
