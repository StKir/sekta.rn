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
  private currentPromiseResolve: ((value: any) => void) | null = null;
  private currentPromiseReject: ((reason?: any) => void) | null = null;

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

    const finalOptions = { ...DEFAULT_OPTIONS, ...options };

    if (this.setOptions) {
      this.setOptions(finalOptions);
    }

    this.setContent(content);
    this.bottomSheetRef.current.present();
  }

  showWithPromise<T = any>(content: React.ReactNode, options?: ShowOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.bottomSheetRef?.current || !this.setContent) {
        reject(new Error('BottomSheet не инициализирован'));
        return;
      }

      this.currentPromiseResolve = resolve;
      this.currentPromiseReject = reject;

      const finalOptions = { ...DEFAULT_OPTIONS, ...options };

      if (this.setOptions) {
        this.setOptions(finalOptions);
      }

      this.setContent(content);
      this.bottomSheetRef.current.present();
    });
  }

  resolvePromise(value: any) {
    if (this.currentPromiseResolve) {
      this.currentPromiseResolve(value);
      this.currentPromiseResolve = null;
      this.currentPromiseReject = null;
    }
    this.hide();
  }

  rejectPromise(reason?: any) {
    if (this.currentPromiseReject) {
      this.currentPromiseReject(reason);
      this.currentPromiseResolve = null;
      this.currentPromiseReject = null;
    }
    this.hide();
  }

  hide() {
    if (!this.bottomSheetRef?.current || !this.setContent) {
      return;
    }

    // Если промис ещё не разрешён, отклоняем его
    if (this.currentPromiseReject) {
      this.currentPromiseReject(new Error('Модальное окно закрыто'));
      this.currentPromiseResolve = null;
      this.currentPromiseReject = null;
    }

    this.setContent(null);
    this.bottomSheetRef.current.dismiss();

    if (this.setOptions) {
      this.setOptions(DEFAULT_OPTIONS);
    }
  }
}

export default BottomSheetManager.getInstance();
