export type RootStackParamList = {
  TabNavigator: undefined;
  Profile: undefined;
  Calendar: undefined;
  Feed: undefined;
  Register: undefined;
  LoginScreen: {
    isPaywall?: boolean;
    duration?: string;
    promo?: string;
  };
  CheckInPage: undefined;
  AiPlayListPage: undefined;
  MomentPage: undefined;
  AiPlans: undefined;
  NotePage: undefined;
  AiQuestionPage: undefined;
  OnboardingPage: undefined;
  AIResultPage: {
    requestId: string;
  };
  AIResultCheckPage: {
    requestId: string | number;
  };
  PaywallPage: {
    onSuccess?: () => void;
  };
};

export type TabParamList = {
  Profile: undefined;
  Calendar: undefined;
  Events: undefined;
  CheckIn: undefined;
};
