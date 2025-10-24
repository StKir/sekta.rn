import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

import { CheckInPost, Post, CustomPost, AIPost, AiResult } from '@/types/lentTypes';
import { StorageService } from '@/shared/utils/storage';

interface LentState {
  posts: Post[];
  total: number;
  aiData: AiResult[];
}

interface LentActions {
  addPost: (data: Post) => void;
  removePost: (id: number | string) => void;
  addCheckIn: (data: CheckInPost) => void;
  addCustomPost: (data: CustomPost) => void;
  changePost: (id: string, data: CustomPost | CheckInPost | AIPost) => void;
  resetPosts: () => void;
  clearAll: () => void;
  getPost: (id: string | number) => Post | undefined;
  addAiData: (data: {
    postId: number | string;
    requestId: string | number;
    status?: 'processing' | 'success' | 'error';
    result?: string | null;
  }) => void;
  updateAiData: (id: number | string, data: AiResult) => void;
}

type LentStore = LentState & LentActions;

const findTodayPost = (posts: Post[]) => {
  const today = new Date().toDateString();
  return posts.find((post) => new Date(post.date).toDateString() === today);
};

const createNewPost = (data: CheckInPost | CustomPost): Post => ({
  date: data.date,
  id: data.id,
  data: [data],
});

const updateTodayPost = (posts: Post[], newData: CheckInPost | CustomPost) => {
  const today = new Date().toDateString();
  return posts.map((post) =>
    new Date(post.date).toDateString() === today ? { ...post, data: [newData, ...post.data] } : post
  );
};

export const useLentStore = create<LentStore>()(
  persist(
    (setState, get) => ({
      posts: [],
      total: 0,
      aiData: [],

      addPost: (data: Post) => {
        setState((state) => ({
          posts: [data, ...state.posts],
          total: state.total + 1,
        }));
      },

      getPost: (id: string | number) => {
        return get().posts.find((post) => post.data.some((item) => String(item.id) === String(id)));
      },

      addCheckIn: (checkInData: CheckInPost) => {
        const posts = get().posts;
        const existingTodayPost = findTodayPost(posts);

        if (existingTodayPost) {
          setState((state) => ({
            posts: updateTodayPost(state.posts, checkInData),
            total: state.total,
          }));
        } else {
          const newPost: Post = {
            date: checkInData.date,
            id: checkInData.id + new Date().getTime().toString(),
            data: [checkInData],
          };

          setState((state) => ({
            posts: [newPost, ...state.posts],
            total: state.total + 1,
          }));
        }
      },

      addCustomPost: (customData: CustomPost) => {
        const posts = get().posts;
        const existingTodayPost = findTodayPost(posts);

        if (existingTodayPost) {
          setState((state) => ({
            posts: updateTodayPost(state.posts, customData),
            total: state.total,
          }));
        } else {
          const newPost = createNewPost(customData);

          setState((state) => ({
            posts: [newPost, ...state.posts],
            total: state.total + 1,
          }));
        }
      },

      changePost: (id: string, data: CustomPost | CheckInPost | AIPost) => {
        setState((state) => ({
          posts: state.posts.map((post) => ({
            ...post,
            data: post.data.map((item) => (String(item.id) === String(id) ? data : item)),
          })),
        }));
      },

      removePost: (id: number | string) => {
        setState((state) => {
          const updatedPosts = state.posts.map((post) => ({
            ...post,
            data: post.data.filter((item) => String(item.id) !== String(id)),
          }));

          const removedCount = state.posts.reduce(
            (count, post) =>
              count + post.data.filter((item) => String(item.id) === String(id)).length,
            0
          );

          return {
            posts: updatedPosts.filter((post) => post.data.length > 0),
            total: Math.max(0, state.total - removedCount),
          };
        });
      },

      addAiData: (data: {
        postId: number | string;
        requestId: string | number;
        status?: 'processing' | 'success' | 'error';
        result?: string | null;
      }) => {
        setState((state) => {
          const newAiData = [
            ...state.aiData,
            {
              postId: String(data.postId),
              requestId: Number(data.requestId),
              status: data.status || 'processing',
              result: data.result || null,
            },
          ];
          return {
            aiData: newAiData,
          };
        });
      },

      updateAiData: (id: number | string, data: AiResult) => {
        setState((state) => ({
          aiData: state.aiData.map((item) =>
            String(item.postId) === String(id) ? { ...item, ...data } : item
          ),
        }));
      },

      resetPosts: () => setState({ posts: [], total: 0 }),

      clearAll: () => setState({ posts: [], total: 0, aiData: [] }),
    }),
    {
      name: 'lent-storage',
      partialize: (state) => {
        console.log('partialize вызвана, aiData:', state.aiData);
        const serializedData = {
          posts: state.posts,
          total: state.total,
          aiData: state.aiData.map((item) => ({
            postId: String(item.postId),
            requestId: Number(item.requestId),
            status: item.status,
            result: item.result,
          })),
        };
        console.log('Сериализованные данные:', serializedData);
        return serializedData;
      },
      storage: createJSONStorage(() => StorageService),
    }
  )
);
