import type { NextApiRequest, NextApiResponse } from 'next';
import ReclaimSDK from '@reclaimprotocol/js-sdk';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { proofId } = req.body;

    // Initialize Reclaim
    const reclaimClient = new ReclaimSDK({
      appId: 'chainbridge-id',
      network: 'development'
    });

    // Verify the proof
    const proof = await reclaimClient.verifyProof(proofId);

    // In production, you would:
    // 1. Store the proof in your database
    // 2. Associate it with the user's account
    // 3. Emit an event to notify the frontend

    res.status(200).json({ success: true, proof });
  } catch (error) {
    console.error('Error processing Reclaim callback:', error);
    res.status(500).json({ message: 'Error processing verification' });
  }
}
