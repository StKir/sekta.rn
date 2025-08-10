import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

import { CheckInPost, Post, CustomPost, AIPost } from '@/types/lentTypes';
import { StorageService } from '@/shared/utils/storage';

interface LentState {
  posts: Post[];
  total: number;
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
}

type LentStore = LentState & LentActions;

export const useLentStore = create<LentStore>()(
  persist(
    (setState, get) => ({
      posts: [],
      total: 0,

      addPost: (data: Post) => {
        setState((state) => {
          return {
            posts: [data, ...state.posts],
            total: state.total + 1,
          };
        });
      },

      getPost: (id: string | number) => {
        return get().posts.find((post) => {
          const aiPost = post.data.find((item) => String(item.id) === String(id));
          return aiPost !== undefined;
        });
      },

      addCheckIn: (checkInData: CheckInPost) => {
        const posts = get().posts;
        const today = new Date().toDateString();
        const existingTodayPost = posts.find((post) => {
          console.log('====================================');
          console.log(new Date(post.date).toDateString(), today);
          console.log('====================================');
          return new Date(post.date).toDateString() === today;
        });

        console.log('====================================');
        console.log(existingTodayPost);
        console.log('====================================');
        if (existingTodayPost) {
          setState((state) => {
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

      changePost: (id: string, data: CustomPost | CheckInPost | AIPost) => {
        setState((state) => ({
          posts: state.posts.map((post) => {
            const foundPost = get().getPost(id);

            if (foundPost) {
              return {
                ...foundPost,
                data: post.data.map((item) => (String(item.id) === String(data.id) ? data : item)),
              };
            }
            return post;
          }),
        }));
      },

      removePost: (_id: number | string) => {
        if (get().posts.length > 0) {
          setState((state) => ({
            posts: state.posts.map((el) => ({
              ...el,
              data: el.data.filter((postItem) => postItem.id !== _id),
            })),
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
