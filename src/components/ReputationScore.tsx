import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  VStack,
  Text,
  HStack,
  Progress,
  Tooltip,
  Skeleton,
} from '@chakra-ui/react';
import { ReputationMetrics, calculateReputationScore } from '../utils/reputation';
import { VerifiedData } from '../utils/reclaim';

interface ReputationScoreProps {
  verifiedData?: VerifiedData[];
  isLoading?: boolean;
}

export function ReputationScore({ verifiedData = [], isLoading = false }: ReputationScoreProps) {
  const [metrics, setMetrics] = useState<ReputationMetrics | null>(null);

  useEffect(() => {
    if (Array.isArray(verifiedData) && verifiedData.length > 0) {
      const calculatedMetrics = calculateReputationScore(verifiedData);
      setMetrics(calculatedMetrics);
    } else {
      // Set default metrics when no data is available
      setMetrics({
        total: 0,
        breakdown: {},
        verifiedAccounts: 0,
        lastUpdated: new Date()
      });
    }
  }, [verifiedData]);

  if (isLoading || !metrics) {
    return (
      <Box p={6} borderWidth={1} borderRadius="lg">
        <VStack spacing={4} align="stretch">
          <Skeleton height="150px" />
          <Skeleton height="20px" />
          <Skeleton height="100px" />
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={4} align="stretch">
        <Box textAlign="center">
          <CircularProgress
            value={metrics.total}
            size="150px"
            thickness="12px"
            color={getScoreColor(metrics.total)}
          >
            <CircularProgressLabel>
              <VStack spacing={0}>
                <Text fontSize="2xl" fontWeight="bold">
                  {Math.round(metrics.total)}
                </Text>
                <Text fontSize="sm">Score</Text>
              </VStack>
            </CircularProgressLabel>
          </CircularProgress>
        </Box>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          Based on {metrics.verifiedAccounts} verified accounts
        </Text>

        <VStack spacing={2} align="stretch">
          {Object.entries(metrics.breakdown).map(([provider, score]) => (
            <Tooltip
              key={provider}
              label={`${provider.charAt(0).toUpperCase() + provider.slice(1)} Score: ${Math.round(score)}`}
            >
              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="sm" textTransform="capitalize">
                    {provider}
                  </Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {Math.round(score)}
                  </Text>
                </HStack>
                <Progress
                  value={score}
                  size="sm"
                  colorScheme={getProgressColor(score)}
                  borderRadius="full"
                />
              </Box>
            </Tooltip>
          ))}
        </VStack>

        <Text fontSize="xs" color="gray.500" textAlign="center">
          Last updated: {metrics.lastUpdated.toLocaleString()}
        </Text>
      </VStack>
    </Box>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'green.400';
  if (score >= 60) return 'blue.400';
  if (score >= 40) return 'yellow.400';
  return 'red.400';
}

function getProgressColor(score: number): string {
  if (score >= 80) return 'green';
  if (score >= 60) return 'blue';
  if (score >= 40) return 'yellow';
  return 'red';
}
