import PagerView from 'react-native-pager-view';
import { View, StyleSheet } from 'react-native';
import React, { useRef, useImperativeHandle, forwardRef } from 'react';

type SwipeableTabViewProps = {
  children: React.ReactNode[];
  activeIndex: number;
  onPageSelected: (index: number) => void;
  style?: any;
};

export type SwipeableTabViewRef = {
  setPage: (index: number) => void;
};

const SwipeableTabView = forwardRef<SwipeableTabViewRef, SwipeableTabViewProps>(
  ({ children, activeIndex, onPageSelected, style }, ref) => {
    const pagerRef = useRef<PagerView>(null);

    useImperativeHandle(ref, () => ({
      setPage: (index: number) => {
        pagerRef.current?.setPage(index);
      },
    }));

    const handlePageSelected = (event: any) => {
      const { position } = event.nativeEvent;
      console.log('Page selected:', position);
      onPageSelected(position);
    };

    return (
      <View style={[styles.container, style]}>
        <PagerView
          initialPage={activeIndex}
          ref={pagerRef}
          scrollEnabled={true}
          style={styles.pagerView}
          onPageSelected={handlePageSelected}
        >
          {children.map((child, index) => (
            <View key={`page-${index}`} style={styles.page}>
              {child}
            </View>
          ))}
        </PagerView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
});

export default SwipeableTabView;
