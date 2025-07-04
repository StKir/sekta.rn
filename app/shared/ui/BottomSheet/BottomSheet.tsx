import { TouchableOpacity } from 'react-native';
import React, { useRef, useMemo, useCallback } from 'react';
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import BottomSheetManager from './BottomSheetManager';
import { styles } from './BottomSheet.styles';

const BottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const snapPoints = useMemo(() => ['60%'], []);
  const [content, setContent] = React.useState<React.ReactNode | null>(null);

  React.useEffect(() => {
    BottomSheetManager.setBottomSheetRef(bottomSheetRef);
    BottomSheetManager.setContentSetter(setContent);
  }, []);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return (
      <TouchableOpacity
        {...props}
        activeOpacity={1}
        style={styles.backdrop}
        onPress={() => {
          BottomSheetManager.hide();
        }}
      />
    );
  }, []);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
      >
        <BottomSheetView style={styles.content}>{content}</BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default BottomSheet;
