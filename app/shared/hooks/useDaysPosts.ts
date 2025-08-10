import { CheckInPost } from '@/types/lentTypes';
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
        id: postData.id,
        data: postData.data
          .map((el) => {
            return {
              ...el.data,
              date: postData.date,
              type: el.type,
            };
          })
          .filter((item) => item.type !== 'ai_text'),
      };
    });
  };

  const getCheckIns = (postsData: any[]) => {
    return postsData.map((el) => ({
      date: el.date,
      id: el.id,
      type: 'check-in',
      data: el.data.filter((item: any) => item.type === 'check-in'),
    })) as CheckInPost[];
  };

  const postsData = getLastFiveDaysPosts();

  const checkIns = getCheckIns(postsData);

  return { postsData, checkIns };
};
