class Features {
  static DEFAULT_PRICE_FROM_CMS = false;
  constructor() {
    Features.DEFAULT_PRICE_FROM_CMS = Features.isFeatureEnabled(
      'DEFAULT_PRICE_FROM_CMS'
    );
  }

  private static isFeatureEnabled(feature: string): boolean {
    if (!process.env[feature]) {
      return false;
    }
    return process.env[feature] === 'true' || false;
  }
}

export { Features };
