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

export type CustomPost = {
  date: string;
  id: string | number;
  type: 'custom';
  data: CustomPostData;
};
