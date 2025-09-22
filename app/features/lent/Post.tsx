import React from 'react';

import NotePost from './components/NotePost/NotePost';
import MomentPost from './components/MomentPost/MomentPost';
import CheckInPost from './components/CheckInPost/CheckInPost';
import AIWeekAnalysisPostComponent from './components/AIWeekAnalysisPost/AIWeekAnalysisPost';

import { PostData, Post as PostType } from '@/types/lentTypes';
import { Share } from '@/shared/ui';

const Post = ({ post }: { post: PostType }) => {
  const postCreator = (postData: PostData) => {
    if (postData.type === 'check-in') {
      return (
        <Share
          id={postData.id}
          key={postData.id}
          message='Посмотри на мой пост в приложении!'
          title='Мой пост'
        >
          <CheckInPost post={postData} />
        </Share>
      );
    }

    if (postData.type === 'moment') {
      return (
        <Share
          id={postData.id}
          key={postData.id}
          message='Посмотри на мой пост в приложении!'
          title='Мой пост'
        >
          <MomentPost post={postData} />
        </Share>
      );
    }

    if (postData.type === 'note') {
      return (
        <Share
          id={postData.id}
          key={postData.id}
          message='Посмотри на мой пост в приложении!'
          title='Мой пост'
        >
          <NotePost post={postData} />
        </Share>
      );
    }

    if (postData.type === 'ai_text') {
      return <AIWeekAnalysisPostComponent key={postData.id} post={postData} />;
    }

    return null;
  };

  return <>{post?.data.map(postCreator).filter(Boolean)}</>;
};

export default Post;
