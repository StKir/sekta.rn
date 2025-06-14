declare module 'react-native-push-notification' {
  export default class PushNotification {
    static configure(options: any): void;
    static localNotificationSchedule(options: any): void;
    static cancelAllLocalNotifications(): void;
    static createChannel(options: any, callback: (created: any) => void): void;
    static channelExists(channelId: string, callback: (exists: boolean) => void): void;
    static deleteChannel(channelId: string): void;
  }
}
