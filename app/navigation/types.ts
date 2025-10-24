export type RootStackParamList = {
  TabNavigator: undefined;
  Profile: undefined;
  Calendar: undefined;
  Feed: undefined;
  Register: undefined;
  CheckInPage: undefined;
  AiPlayListPage: undefined;
  MomentPage: undefined;
  AiPlans: undefined;
  NotePage: undefined;
  AIQuestionPage: undefined;
  OnboardingPage: undefined;
  AIResultPage: {
    requestId: string;
  };
  AIResultCheckPage: {
    requestId: string | number;
  };
};

export type TabParamList = {
  Profile: undefined;
  Calendar: undefined;
  Events: undefined;
  CheckIn: undefined;
};
