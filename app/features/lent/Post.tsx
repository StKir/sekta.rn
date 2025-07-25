import React from 'react';

import MomentPost from './components/MomentPost/MomentPost';
import CheckInPost from './components/CheckInPost/CheckInPost';

import { PostData, Post as PostType } from '@/types/lentTypes';
import { Share } from '@/shared/ui';

const Post = ({ post }: { post: PostType }) => {
  const postCreator = (postData: PostData) => {
    if (postData.type === 'check-in') {
      return (
        <Share key={postData.id} message='Посмотри на мой пост в приложении!' title='Мой пост'>
          <CheckInPost post={postData} />
        </Share>
      );
    }

    if (postData.type === 'moment') {
      return (
        <Share key={postData.id} message='Посмотри на мой пост в приложении!' title='Мой пост'>
          <MomentPost post={postData} />
        </Share>
      );
    }
  };
  return post?.data.map(postCreator);
};

export default Post;
