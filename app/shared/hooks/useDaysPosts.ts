import { useLentStore } from '@/entities/lent/store/store';

export const useDaysPosts = (days: number) => {
  const { posts } = useLentStore();

  const getLastFiveDaysPosts = () => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - days);

    return posts.filter((post) => {
      const postDate = new Date(post.date);
      return postDate >= fiveDaysAgo;
    });
  };

  const postsData = getLastFiveDaysPosts();

  return { postsData };
};
