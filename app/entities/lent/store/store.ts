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
      userTime: null,

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
