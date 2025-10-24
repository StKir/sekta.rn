import ViewShot from 'react-native-view-shot';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity, Alert } from 'react-native';
import React, { useRef } from 'react';

import { PostData } from '@/types/lentTypes';
import { useTheme } from '@/shared/theme';
import { useScreenshotShare } from '@/shared/hooks/useScreenshotShare';
import { useLentStore } from '@/entities/lent/store/store';
import AiCheck from '@/entities/ai/Aicheck/AiCheck';

type ShareProps = {
  children: React.ReactNode;
  id: number | string;
  title?: string;
  message?: string;
  iconSize?: number;
  requestId?: number | null;
  iconColor?: string;
  buttonStyle?: any;
  aiData?: PostData;
  showOptionsMenu?: boolean; // Показывать ли меню выбора действий
  openGalleryAfterSave?: boolean; // Открывать ли галерею после сохранения
};

const Share = ({
  children,
  aiData,
  iconSize = 24,
  iconColor,
  id,
  buttonStyle,
  openGalleryAfterSave = true,
}: ShareProps) => {
  const { colors } = useTheme();
  const viewShotRef = useRef<ViewShot>(null);
  const { removePost } = useLentStore();

  const { handleShare } = useScreenshotShare({ openGalleryAfterSave });

  const onShare = () => handleShare(viewShotRef);

  const onDelete = () => {
    Alert.alert('Удалить пост?', 'Вы уверены, что хотите удалить этот пост?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', onPress: () => removePost(id) },
    ]);
  };

  return (
    <View style={{ position: 'relative' }}>
      <ViewShot
        options={{
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        }}
        ref={viewShotRef}
      >
        {children}
      </ViewShot>
      <View
        style={[
          {
            position: 'absolute',
            top: 12,
            right: 12,
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 10,
          },
          buttonStyle,
        ]}
      >
        {aiData && <AiCheck post={aiData} />}
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: colors.PRIMARY_ALPHA,
            borderWidth: 1,
          }}
          onPress={onShare}
        >
          <Icon color={iconColor || colors.GRAY_2} name='share' size={iconSize} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            borderRadius: 5,
            borderColor: colors.PRIMARY_ALPHA,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={onDelete}
        >
          <Icon color={iconColor || colors.GRAY_2} name='cut' size={iconSize} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Share;
