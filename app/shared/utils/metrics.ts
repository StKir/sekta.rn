import AppMetrica from '@appmetrica/react-native-analytics';

export const Metrics = {
  recordCreated: (recordTypes: string[]) => {
    AppMetrica.reportEvent('record_created', {
      record_types: recordTypes.join(','),
    });
  },

  paywallOpened: () => {
    AppMetrica.reportEvent('paywall_opened');
  },

  subscriptionPurchased: (duration: '1month' | '3months' | '1year', price: string) => {
    const prices: Record<string, number> = {
      '1month': 349,
      '3months': 799,
      '1year': 1999,
    };

    AppMetrica.reportEvent('subscription_purchased', {
      duration,
      price: price || prices[duration],
      price_currency: 'RUB',
    });
  },

  appOpened: () => {
    AppMetrica.reportEvent('app_opened');
  },

  registrationCompleted: () => {
    AppMetrica.reportEvent('registration_completed');
  },

  aiUsed: (
    tool: 'chat' | 'week_analysis' | 'records_analysis' | 'question' | 'playlist' | 'plans'
  ) => {
    AppMetrica.reportEvent('ai_used', {
      tool,
    });
  },

  reportError: (error: Error, context?: Record<string, string>) => {
    const errorMessage = error.message || 'Unknown error';
    AppMetrica.reportErrorWithoutIdentifier(errorMessage, error);
    if (context) {
      AppMetrica.reportEvent('error_occurred', {
        error_message: errorMessage,
        error_name: error.name || 'Error',
        ...context,
      });
    }
  },

  reportApiError: (
    endpoint: string,
    method: string,
    statusCode?: number,
    errorMessage?: string,
    additionalData?: Record<string, string>
  ) => {
    AppMetrica.reportEvent('api_error', {
      endpoint,
      method,
      status_code: statusCode?.toString() || 'unknown',
      error_message: errorMessage || 'Unknown error',
      ...additionalData,
    });
  },
};
