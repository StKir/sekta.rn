import React, { useRef, useMemo, useCallback } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import BottomSheetManager from './BottomSheetManager';
import { styles } from './BottomSheet.styles';

interface ShowOptions {
  snapPoints?: (string | number)[];
  detached?: boolean;
  topInset?: number;
  bottomInset?: number;
}

const BottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const [content, setContent] = React.useState<React.ReactNode | null>(null);
  const [options, setOptions] = React.useState<ShowOptions>({
    snapPoints: ['60%'],
    detached: false,
    topInset: 0,
    bottomInset: 0,
  });

  const snapPoints = useMemo(() => {
    return options.snapPoints || ['60%'];
  }, [options.snapPoints]);

  React.useEffect(() => {
    BottomSheetManager.setBottomSheetRef(bottomSheetRef);
    BottomSheetManager.setContentSetter(setContent);
    BottomSheetManager.setOptionsSetter(setOptions);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={() => BottomSheetManager.hide()}
      />
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        {...(options.detached && {
          detached: true,
          topInset: options.topInset || 0,
          bottomInset: options.bottomInset || 0,
          style: { marginHorizontal: 0 },
        })}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.content}>{content}</BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default BottomSheet;
