import React from 'react';

import DateWrapper from './components/DateWrapper/DateWrapper';
import CheckInPost from './components/CheckInPost/CheckInPost';

import { Post as PostType } from '@/types/lentTypes';

const Post = ({ post }: { post: PostType }) => {
  return (
    <DateWrapper date={post.date}>
      {post?.data.map((item) => {
        if (item.type === 'check-in') {
          return <CheckInPost key={item.id} post={item} />;
        }
      })}
    </DateWrapper>
  );
};

export default Post;
