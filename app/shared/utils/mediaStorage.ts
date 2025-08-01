import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

const MEDIA_FOLDER = 'media';

export class MediaStorageService {
  private static async getMediaDirectory(): Promise<string> {
    const baseDir = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DocumentDirectoryPath;

    const mediaDir = `${baseDir}/${MEDIA_FOLDER}`;

    const exists = await RNFS.exists(mediaDir);
    if (!exists) {
      await RNFS.mkdir(mediaDir);
    }

    return mediaDir;
  }

  static async saveMediaFile(sourceUri: string, fileName: string): Promise<string> {
    try {
      const mediaDir = await this.getMediaDirectory();
      const extension = fileName.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${Math.random().toString(36).substr(2, 9)}.${extension}`;
      const destinationPath = `${mediaDir}/${uniqueFileName}`;

      await RNFS.copyFile(sourceUri, destinationPath);

      return destinationPath;
    } catch (error) {
      console.error('Error saving media file:', error);
      throw error;
    }
  }

  static async deleteMediaFile(filePath: string): Promise<boolean> {
    try {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        await RNFS.unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting media file:', error);
      return false;
    }
  }

  static async fileExists(filePath: string): Promise<boolean> {
    try {
      return await RNFS.exists(filePath);
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }

  static getFileUri(filePath: string): string {
    if (Platform.OS === 'ios') {
      return `file://${filePath}`;
    }
    return `file://${filePath}`;
  }

  static async cleanupOrphanedFiles(usedFilePaths: string[]): Promise<void> {
    try {
      const mediaDir = await this.getMediaDirectory();
      const files = await RNFS.readDir(mediaDir);

      for (const file of files) {
        if (!usedFilePaths.includes(file.path)) {
          await this.deleteMediaFile(file.path);
        }
      }
    } catch (error) {
      console.error('Error cleaning up orphaned files:', error);
    }
  }
}
