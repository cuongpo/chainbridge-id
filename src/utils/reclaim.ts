import { default as ReclaimSDK } from '@reclaimprotocol/js-sdk';

export interface ReclaimProvider {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
}

export interface VerifiedData {
  provider: string;
  timestamp: number;
  data: any;
}

const MOCK_PROVIDERS: ReclaimProvider[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Verify your GitHub contributions',
    logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    description: 'Verify your Twitter activity',
    logoUrl: 'https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png'
  }
];

export class ReclaimService {
  private reclaim: typeof ReclaimSDK | null = null;
  private callbackUrl: string = '';

  constructor() {
    // Initialize Reclaim only on client-side
    if (typeof window !== 'undefined') {
      try {
        this.reclaim = ReclaimSDK;
        this.callbackUrl = `${window.location.origin}/api/reclaim/callback`;
      } catch (error) {
        console.error('Error initializing Reclaim:', error);
      }
    }
  }

  async getProviders(): Promise<ReclaimProvider[]> {
    // For now, return mock providers
    // In production, you would fetch this from Reclaim
    return Promise.resolve(MOCK_PROVIDERS);
  }

  async startVerification(providerId: string): Promise<string> {
    if (!this.reclaim) {
      throw new Error('Reclaim is not initialized (SSR)');
    }

    try {
      const reclaimClient = new this.reclaim({
        appId: 'chainbridge-id',
        network: 'development'
      });

      const request = await reclaimClient.request({
        title: 'Verify your identity',
        requestedProofs: [
          {
            name: providerId,
            provider: providerId as any,
            params: {}
          }
        ],
        callbackUrl: this.callbackUrl
      });

      return request.url;
    } catch (error) {
      console.error('Error starting verification:', error);
      throw error;
    }
  }

  async verifyProof(proofId: string): Promise<VerifiedData> {
    if (!this.reclaim) {
      throw new Error('Reclaim is not initialized (SSR)');
    }

    try {
      const reclaimClient = new this.reclaim({
        appId: 'chainbridge-id',
        network: 'development'
      });

      const proof = await reclaimClient.verifyProof(proofId);
      return {
        provider: proof.provider,
        timestamp: Date.now(),
        data: proof
      };
    } catch (error) {
      console.error('Error verifying proof:', error);
      throw error;
    }
  }
}
