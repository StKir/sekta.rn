import { MediaItem } from '@/shared/ui/MediaPicker/MediaPicker';

export interface ColorObject {
  id: number;
  name: string;
  color: string;
}

export type PostData = CheckInPost | CustomPost;

export type Post = {
  date: string;
  id: string | number;
  data: PostData[];
};

export type CheckInPostData = {
  mood: string;
  color?: ColorObject;
  quote?: string;
  note?: string;
  media?: MediaItem[];
  activities: string[];
  emotions: string[];
  power?: number;
  stress?: number;
};

export type MomentPostData = {
  note?: string;
  media?: MediaItem[];
  emotions?: string[];
  name?: string;
};

export type CustomPostData = {
  title: string;
  content: string;
  tags?: string[];
};

export type CheckInPost = {
  date: string;
  id: string | number;
  type: 'check-in';
  data: CheckInPostData;
};

export type AiResult = {
  postId: string;
  requestId: number;
  result: string | null;
  status: 'processing' | 'success' | 'error';
};

export type MomentInPost = {
  date: string;
  id: string | number;
  type: 'moment';
  data: MomentPostData;
};

export type NotePost = {
  date: string;
  id: string | number;
  type: 'note';
  data: NotePostData;
};

export type NotePostData = {
  name: string;
  note: string;
  media?: MediaItem[];
};

export type AIPost = {
  date: string;
  id: string | number;
  type: 'ai_text';
  title: string;
  data: {
    result: string;
    status: 'processing' | 'success' | 'error';
  };
};

export type CustomPost =
  | {
      date: string;
      id: string | number;
      type: 'custom';
      data: CustomPostData;
    }
  | MomentInPost
  | AIPost
  | NotePost;
