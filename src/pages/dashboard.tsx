import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  useToast,
  Spinner,
  Center,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { VerifiedDataSection } from '../components/VerifiedData';
import { CrossChainActivity } from '../components/CrossChainActivity';

// Mock data for demonstration
const mockTransactions = [
  {
    id: '1',
    fromChain: 'Ethereum',
    toChain: 'Polygon',
    status: 'completed',
    timestamp: new Date('2024-12-12'),
    amount: '0.5 ETH'
  },
  {
    id: '2',
    fromChain: 'Polygon',
    toChain: 'Arbitrum',
    status: 'pending',
    timestamp: new Date('2024-12-13'),
    amount: '100 USDC'
  }
];

export default function Dashboard() {
  const { user, logout, isAuthenticated, loading, initialized } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (initialized && !isAuthenticated && !loading) {
      router.replace('/');
    }
  }, [initialized, isAuthenticated, loading, router]);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
      status: 'success',
      duration: 3000,
    });
    router.push('/');
  };

  if (loading || !initialized) {
    return (
      <Container maxW="container.xl" py={10}>
        <Center h="50vh">
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading as="h1" size="xl">Dashboard</Heading>
          <Button onClick={handleLogout}>
            Logout
          </Button>
        </HStack>

        <Box p={6} borderWidth={1} borderRadius="lg">
          <VStack align="stretch" spacing={4}>
            <Heading size="md">Your ChainBridge ID</Heading>
            <Text><strong>Address:</strong> {user?.address}</Text>
            <Text><strong>Connected Chains:</strong> {user?.chainIds?.join(', ') || 'None'}</Text>
          </VStack>
        </Box>

        <Divider />

        <Box p={6} borderWidth={1} borderRadius="lg">
          <VerifiedDataSection />
        </Box>

        <CrossChainActivity transactions={mockTransactions} />

        <Box p={6} borderWidth={1} borderRadius="lg">
          <VStack align="stretch" spacing={4}>
            <Heading size="md">Available Actions</Heading>
            <Button
              onClick={() => {
                toast({
                  title: 'Coming soon',
                  description: 'Cross-chain transfers will be implemented soon',
                  status: 'info',
                  duration: 3000,
                });
              }}
            >
              Cross-Chain Transfer
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: 'Coming soon',
                  description: 'Identity verification will be implemented soon',
                  status: 'info',
                  duration: 3000,
                });
              }}
            >
              Verify Identity
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
