import { VerifiedData } from './reclaim';

export interface ReputationMetrics {
  total: number;
  breakdown: {
    [key: string]: number;
  };
  verifiedAccounts: number;
  lastUpdated: Date;
}

const PROVIDER_WEIGHTS = {
  github: 30,
  twitter: 20,
  linkedin: 25,
  google: 15,
  facebook: 10
};

const ACTIVITY_WEIGHTS = {
  commits: 2,
  followers: 1,
  repositories: 3,
  tweets: 0.5,
  connections: 1.5
};

export function calculateReputationScore(verifiedData: VerifiedData[]): ReputationMetrics {
  const breakdown: { [key: string]: number } = {};
  let total = 0;
  
  verifiedData.forEach(data => {
    const provider = data.provider.toLowerCase();
    let providerScore = 0;

    // Base score for having a verified account
    providerScore += PROVIDER_WEIGHTS[provider] || 10;

    // Additional score based on activity
    if (data.data) {
      if (provider === 'github') {
        const { commits = 0, followers = 0, repositories = 0 } = data.data;
        providerScore += (
          commits * ACTIVITY_WEIGHTS.commits +
          followers * ACTIVITY_WEIGHTS.followers +
          repositories * ACTIVITY_WEIGHTS.repositories
        );
      } else if (provider === 'twitter') {
        const { tweets = 0, followers = 0 } = data.data;
        providerScore += (
          tweets * ACTIVITY_WEIGHTS.tweets +
          followers * ACTIVITY_WEIGHTS.followers
        );
      }
      // Add more provider-specific calculations here
    }

    breakdown[provider] = Math.min(providerScore, 100); // Cap at 100 per provider
    total += breakdown[provider];
  });

  // Normalize total score to be between 0-100
  const normalizedTotal = Math.min(total, 100);

  return {
    total: normalizedTotal,
    breakdown,
    verifiedAccounts: verifiedData.length,
    lastUpdated: new Date()
  };
}
