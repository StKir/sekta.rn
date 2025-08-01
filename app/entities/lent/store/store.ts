import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

import { CheckInPost, Post, CustomPost } from '@/types/lentTypes';
import { StorageService } from '@/shared/utils/storage';

interface LentState {
  posts: Post[];
  total: number;
}

interface LentActions {
  addPost: (data: Post) => void;
  removePost: (id: number) => void;
  addCheckIn: (data: CheckInPost) => void;
  addCustomPost: (data: CustomPost) => void;
  resetPosts: () => void;
  clearAll: () => void;
}

type LentStore = LentState & LentActions;

export const useLentStore = create<LentStore>()(
  persist(
    (setState, get) => ({
      posts: [],
      total: 0,

      addPost: (data: Post) =>
        setState((state) => {
          return {
            posts: [data, ...state.posts],
            total: state.total + 1,
          };
        }),

      addCheckIn: (checkInData: CheckInPost) => {
        const posts = get().posts;
        const today = new Date().toDateString();
        const existingTodayPost = posts.find(
          (post) => new Date(post.date).toDateString() === today
        );

        if (existingTodayPost) {
          setState((state) => {
            console.log(state.posts, 'state');
            return {
              posts: state.posts.map((post) =>
                new Date(post.date).toDateString() === today
                  ? {
                      ...post,
                      data: [checkInData, ...post.data],
                    }
                  : post
              ),
              total: state.total,
            };
          });
        } else {
          const newPost: Post = {
            date: checkInData.date,
            id: checkInData.id,
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

        const today = new Date().toDateString();
        const existingTodayPost = posts.find(
          (post) => new Date(post.date).toDateString() === today
        );

        if (existingTodayPost) {
          setState((state) => ({
            posts: state.posts.map((post) =>
              new Date(post.date).toDateString() === today
                ? {
                    ...post,
                    data: [customData, ...post.data],
                  }
                : post
            ),
            total: state.total,
          }));
        } else {
          const newPost: Post = {
            date: customData.date,
            id: customData.id,
            data: [customData],
          };

          setState((state) => ({
            posts: [newPost, ...state.posts],
            total: state.total + 1,
          }));
        }
      },

      removePost: (_id: number) => {
        if (get().posts.length > 0) {
          setState((state) => ({
            posts: state.posts.slice(0, -1),
            total: Math.max(0, state.total - 1),
          }));
        }
      },

      resetPosts: () => setState({ posts: [], total: 0 }),

      clearAll: () => setState({ posts: [], total: 0 }),
    }),
    {
      name: 'lent-storage',
      partialize: (state) => ({ posts: state.posts, total: state.total }),
      storage: createJSONStorage(() => StorageService),
    }
  )
);
