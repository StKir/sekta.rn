import { RewardedAdLoader, AdRequestConfiguration, RewardedAd, Gender } from 'yandex-mobile-ads';
import { useState, useCallback } from 'react';

import { Metrics } from '@/shared/utils/metrics';
import { useUser } from '@/shared/hooks/useUser';
import { AD_UNIT_ID } from '@/env';

const CONTEXT_QUERY = '';
const CONTEXT_TAGS: string[] = [
  'Психология',
  'Коуч',
  'Настроение',
  'Путешествия',
  'Психолог',
  'Личностные рост',
  'ИИ',
  'Писхологические тесты',
];

type UseTokenAdReturn = {
  isLoading: boolean;
  isLoaded: boolean;
  loadAd: () => Promise<void>;
  showAd: (onRewarded?: () => void) => Promise<void>;
  error: Error | null;
};

export const useTokenAd = (): UseTokenAdReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [ad, setAd] = useState<RewardedAd | null>(null);
  const { userAge, userGender } = useUser();

  const getGenderValue = useCallback((): Gender | undefined => {
    if (!userGender) {
      return undefined;
    }

    if (typeof userGender === 'string') {
      if (userGender.toLowerCase() === 'male' || userGender.toLowerCase() === 'мужской') {
        return Gender.Male;
      }
      if (userGender.toLowerCase() === 'female' || userGender.toLowerCase() === 'женский') {
        return Gender.Female;
      }
      return undefined;
    }

    if (typeof userGender === 'object' && userGender.name) {
      const genderName = userGender.name.toLowerCase();
      if (genderName === 'male' || genderName === 'мужской') {
        return Gender.Male;
      }
      if (genderName === 'female' || genderName === 'женский') {
        return Gender.Female;
      }
    }

    return undefined;
  }, [userGender]);

  const loadAd = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsLoaded(false);

      const loader = await RewardedAdLoader.create().catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to create ad loader'));
        setIsLoading(false);
        return null;
      });

      if (!loader) {
        return;
      }

      const adRequestConfigParams: {
        adUnitId: string;
        age?: string;
        contextQuery?: string;
        contextTags?: string[];
        gender?: Gender;
      } = {
        adUnitId: AD_UNIT_ID,
      };

      if (userAge) {
        adRequestConfigParams.age = userAge.toString();
      }

      if (CONTEXT_QUERY) {
        adRequestConfigParams.contextQuery = CONTEXT_QUERY;
      }

      if (CONTEXT_TAGS.length > 0) {
        adRequestConfigParams.contextTags = CONTEXT_TAGS;
      }

      const genderValue = getGenderValue();
      if (genderValue) {
        adRequestConfigParams.gender = genderValue;
      }

      const adRequestConfig = new AdRequestConfiguration(adRequestConfigParams);

      const loadedAd = await loader.loadAd(adRequestConfig).catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to load ad'));
        setIsLoading(false);
        return null;
      });

      if (!loadedAd) {
        return;
      }

      setAd(loadedAd);
      setAd(loadedAd);
      setIsLoaded(true);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsLoading(false);
      setIsLoaded(false);
    }
  }, [userAge, getGenderValue]);

  const showAd = useCallback(
    async (onRewarded?: () => void) => {
      if (!ad || !isLoaded) {
        setError(new Error('Ad is not loaded'));
        return;
      }

      try {
        ad.onAdShown = () => {};

        ad.onAdFailedToShow = (err) => {
          if (err) {
            const errorMessage = typeof err === 'string' ? err : JSON.stringify(err);
            setError(new Error(errorMessage));
          }
          setIsLoaded(false);
          setAd(null);
        };

        ad.onAdClicked = () => {};

        ad.onAdDismissed = () => {
          setIsLoaded(false);
          setAd(null);
        };

        ad.onAdImpression = () => {};

        ad.onRewarded = () => {
          Metrics.adRewardedViewed(AD_UNIT_ID);
          if (onRewarded) {
            onRewarded();
          }
        };

        ad.show();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to show ad'));
        setIsLoaded(false);
        setAd(null);
      }
    },
    [ad, isLoaded]
  );

  return {
    isLoading,
    isLoaded,
    loadAd,
    showAd,
    error,
  };
};
