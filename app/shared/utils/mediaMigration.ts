import { MediaStorageService } from './mediaStorage';

import { Post, CheckInPost, MomentInPost } from '@/types/lentTypes';
import { MediaItem } from '@/shared/ui/MediaPicker/MediaPicker';
import { useLentStore } from '@/entities/lent/store/store';

export class MediaMigrationService {
  static async migrateExistingMedia() {
    try {
      const { posts } = useLentStore.getState();
      let hasChanges = false;

      const updatedPosts = await Promise.all(
        posts.map(async (post: Post) => {
          const updatedData = await Promise.all(
            post.data.map(async (postData) => {
              let updatedPostData = postData;

              if (postData.type === 'check-in') {
                const checkInPost = postData as CheckInPost;
                if (checkInPost.data.media) {
                  const updatedMedia = await this.migrateMediaArray(checkInPost.data.media);
                  if (updatedMedia !== checkInPost.data.media) {
                    hasChanges = true;
                    updatedPostData = {
                      ...checkInPost,
                      data: { ...checkInPost.data, media: updatedMedia },
                    };
                  }
                }
              } else if (postData.type === 'moment') {
                const momentPost = postData as MomentInPost;
                if (momentPost.data.media) {
                  const updatedMedia = await this.migrateMediaArray(momentPost.data.media);
                  if (updatedMedia !== momentPost.data.media) {
                    hasChanges = true;
                    updatedPostData = {
                      ...momentPost,
                      data: { ...momentPost.data, media: updatedMedia },
                    };
                  }
                }
              }

              return updatedPostData;
            })
          );

          return { ...post, data: updatedData };
        })
      );

      if (hasChanges) {
        useLentStore.setState({ posts: updatedPosts });
        console.log('Media migration completed successfully');
      }
    } catch (error) {
      console.error('Media migration failed:', error);
    }
  }

  private static async migrateMediaArray(media: MediaItem[]): Promise<MediaItem[]> {
    return Promise.all(
      media.map(async (mediaItem: MediaItem) => {
        if (mediaItem.uri && !mediaItem.uri.startsWith('/')) {
          try {
            const exists = await MediaStorageService.fileExists(mediaItem.uri);
            if (exists) {
              const newPath = await MediaStorageService.saveMediaFile(
                mediaItem.uri,
                mediaItem.fileName || `migrated_${Date.now()}`
              );
              return { ...mediaItem, uri: newPath };
            }
          } catch (error) {
            console.warn('Failed to migrate media:', mediaItem.uri, error);
          }
        }
        return mediaItem;
      })
    );
  }

  static async cleanupTemporaryFiles() {
    try {
      const { posts } = useLentStore.getState();
      const usedFilePaths: string[] = [];

      posts.forEach((post: Post) => {
        post.data.forEach((postData) => {
          if (postData.type === 'check-in') {
            const checkInPost = postData as CheckInPost;
            if (checkInPost.data.media) {
              checkInPost.data.media.forEach((mediaItem: MediaItem) => {
                if (mediaItem.uri.startsWith('/')) {
                  usedFilePaths.push(mediaItem.uri);
                }
              });
            }
          } else if (postData.type === 'moment') {
            const momentPost = postData as MomentInPost;
            if (momentPost.data.media) {
              momentPost.data.media.forEach((mediaItem: MediaItem) => {
                if (mediaItem.uri.startsWith('/')) {
                  usedFilePaths.push(mediaItem.uri);
                }
              });
            }
          }
        });
      });

      await MediaStorageService.cleanupOrphanedFiles(usedFilePaths);
      console.log('Cleanup completed successfully');
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}
