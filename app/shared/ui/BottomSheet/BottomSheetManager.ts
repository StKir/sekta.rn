/* eslint-disable @typescript-eslint/no-deprecated */
import React from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

interface ShowOptions {
  snapPoints?: (string | number)[];
  detached?: boolean;
  topInset?: number;
  bottomInset?: number;
}

const DEFAULT_OPTIONS: ShowOptions = {
  snapPoints: ['60%'],
  detached: false,
  topInset: 0,
  bottomInset: 0,
};

class BottomSheetManager {
  private static instance: BottomSheetManager;
  private bottomSheetRef: React.MutableRefObject<BottomSheetModal | null> | null = null;
  private setContent: ((content: React.ReactNode | null) => void) | null = null;
  private setOptions: ((options: ShowOptions) => void) | null = null;

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

  setOptionsSetter(setter: (options: ShowOptions) => void) {
    this.setOptions = setter;
  }

  show(content: React.ReactNode, options?: ShowOptions) {
    if (!this.bottomSheetRef?.current || !this.setContent) {
      return;
    }

    // Всегда устанавливаем опции, либо переданные, либо дефолтные
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };

    if (this.setOptions) {
      this.setOptions(finalOptions);
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

    // Сбрасываем опции на дефолтные после закрытия
    if (this.setOptions) {
      this.setOptions(DEFAULT_OPTIONS);
    }
  }
}

export default BottomSheetManager.getInstance();
