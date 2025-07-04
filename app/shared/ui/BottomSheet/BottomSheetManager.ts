/* eslint-disable @typescript-eslint/no-deprecated */
import React from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

class BottomSheetManager {
  private static instance: BottomSheetManager;
  private bottomSheetRef: React.MutableRefObject<BottomSheetModal | null> | null = null;
  private setContent: ((content: React.ReactNode | null) => void) | null = null;

  private constructor() {}

  static getInstance(): BottomSheetManager {
    if (!BottomSheetManager.instance) {
      BottomSheetManager.instance = new BottomSheetManager();
    }
    return BottomSheetManager.instance;
  }

  setBottomSheetRef(ref: React.MutableRefObject<BottomSheetModal | null>) {
    this.bottomSheetRef = ref;
  }

  setContentSetter(setter: (content: React.ReactNode | null) => void) {
    this.setContent = setter;
  }

  show(content: React.ReactNode) {
    if (!this.bottomSheetRef?.current || !this.setContent) {
      return;
    }

    this.setContent(content);
    this.bottomSheetRef.current.present();
  }

  hide() {
    if (!this.bottomSheetRef?.current || !this.setContent) {
      return;
    }

    this.setContent(null);
    this.bottomSheetRef.current.dismiss();
  }
}

export default BottomSheetManager.getInstance();
