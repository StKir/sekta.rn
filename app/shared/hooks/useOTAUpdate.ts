/* eslint-disable no-console */
import hotUpdate from 'react-native-ota-hot-update';
import DeviceInfo from 'react-native-device-info';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform, UIManager } from 'react-native';
import { useEffect, useState } from 'react';

import { OTA_UPDATE_URL } from '../constants/urls';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type UpdateData = {
  [key: string]: {
    bundleVersion: number;
    downloadAndroidUrl: string;
    downloadIosUrl: string;
  };
};

export const useOTAUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState('0');

  const startUpdate = async (url: string, newVersion: number) => {
    try {
      setLoading(true);
      await hotUpdate.downloadBundleUri(ReactNativeBlobUtil, url, newVersion, {
        updateSuccess: () => {
          setLoading(false);
        },
        updateFail() {
          setLoading(false);
        },
        progress() {
          setLoading(true);
        },
        restartAfterInstall: true,
      });
    } catch (error) {
      console.error('Ошибка обновления:', error);
      setLoading(false);
    }
  };

  const onCheckVersion = async () => {
    try {
      const response = await fetch(OTA_UPDATE_URL, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
      const result = (await response.json()) as UpdateData;
      const currentVersion = await hotUpdate.getCurrentVersion();
      const currentAppVersion = DeviceInfo.getVersion();

      const updateInfo = result[currentAppVersion];

      if (!updateInfo) {
        return;
      }

      if (updateInfo.bundleVersion > currentVersion) {
        const downloadUrl =
          Platform.OS === 'ios' ? updateInfo.downloadIosUrl : updateInfo.downloadAndroidUrl;

        await startUpdate(downloadUrl, updateInfo.bundleVersion);
      }
    } catch (error) {
      console.error('Ошибка проверки обновлений:', error);
    }
  };

  useEffect(() => {
    const getCurrentVersion = async () => {
      try {
        const data = await hotUpdate.getCurrentVersion();
        setVersion(`${data}`);
      } catch (error) {
        console.error('Ошибка получения текущей версии:', error);
      }
    };

    getCurrentVersion();
  }, []);

  return {
    version: {
      onCheckVersion,
      state: {
        loading,
        version,
      },
    },
  };
};
