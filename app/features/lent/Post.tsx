import React from 'react';

import NotePost from './components/NotePost/NotePost';
import MomentPost from './components/MomentPost/MomentPost';
import CheckInPost from './components/CheckInPost/CheckInPost';
import AIWeekAnalysisPostComponent from './components/AIWeekAnalysisPost/AIWeekAnalysisPost';

import { PostData, Post as PostType } from '@/types/lentTypes';

const Post = ({ post }: { post: PostType }) => {
  const postCreator = (postData: PostData) => {
    if (postData.type === 'check-in') {
      return <CheckInPost key={postData.id} post={postData} />;
    }

    if (postData.type === 'moment') {
      return <MomentPost key={postData.id} post={postData} />;
    }

    if (postData.type === 'note') {
      return <NotePost key={postData.id} post={postData} />;
    }

    if (postData.type === 'ai_text' || postData.type === 'ai_slides') {
      return <AIWeekAnalysisPostComponent key={postData.id} post={postData} />;
    }

    return null;
  };

  return <>{post?.data.map(postCreator).filter(Boolean)}</>;
};

export default Post;
