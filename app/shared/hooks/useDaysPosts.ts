import { useLentStore } from '@/entities/lent/store/store';

export const useDaysPosts = (days: number) => {
  const { posts } = useLentStore();

  const getLastFiveDaysPosts = () => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - days);

    const lastDaysPosts = posts.filter((post) => {
      const postDate = new Date(post.date);
      return postDate >= fiveDaysAgo;
    });

    return lastDaysPosts.map((postData) => {
      return {
        date: postData.date,
        type: postData.id,
        data: postData.data.map((el) => {
          return {
            ...el.data,
            type: el.type,
          };
        }),
      };
    });
  };

  const postsData = getLastFiveDaysPosts();

  return { postsData };
};
