import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useToast,
  Badge,
  Icon,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { ReclaimService, ReclaimProvider, VerifiedData } from '../utils/reclaim';
import { ReputationScore } from './ReputationScore';
import dynamic from 'next/dynamic';

// Create the component with no SSR
function VerifiedDataSectionComponent() {
  const [providers, setProviders] = useState<ReclaimProvider[]>([]);
  const [verifiedData, setVerifiedData] = useState<VerifiedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<ReclaimProvider | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [reclaimService] = useState(() => new ReclaimService());

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const availableProviders = await reclaimService.getProviders();
      setProviders(availableProviders);
    } catch (error) {
      console.error('Error loading providers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load verification providers',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (provider: ReclaimProvider) => {
    setLoading(true);
    try {
      setSelectedProvider(provider);
      const verificationUrl = await reclaimService.startVerification(provider.id);
      window.open(verificationUrl, '_blank');
      onOpen();
    } catch (error) {
      console.error('Error starting verification:', error);
      toast({
        title: 'Error',
        description: 'Failed to start verification process',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = async () => {
    try {
      // For demo purposes, create mock verified data
      const mockData: VerifiedData = {
        provider: selectedProvider?.id || 'unknown',
        timestamp: Date.now(),
        data: {
          commits: Math.floor(Math.random() * 1000),
          repositories: Math.floor(Math.random() * 50),
          followers: Math.floor(Math.random() * 500),
          tweets: Math.floor(Math.random() * 2000),
        }
      };

      setVerifiedData(prev => [...prev, mockData]);
      onClose();
      toast({
        title: 'Success',
        description: 'Data verified successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error verifying data:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify data',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <ReputationScore verifiedData={verifiedData} isLoading={loading} />

        <Heading size="md">Verified Data</Heading>
        
        {verifiedData.length > 0 && (
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            {verifiedData.map((data, index) => (
              <Box
                key={index}
                p={4}
                borderWidth={1}
                borderRadius="lg"
                position="relative"
              >
                <Icon
                  as={CheckCircleIcon}
                  color="green.500"
                  position="absolute"
                  top={2}
                  right={2}
                />
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold" textTransform="capitalize">{data.provider}</Text>
                  <Text fontSize="sm">
                    Verified on: {new Date(data.timestamp).toLocaleDateString()}
                  </Text>
                  {data.data && (
                    <VStack align="start" spacing={1}>
                      {Object.entries(data.data).map(([key, value]) => (
                        <Text key={key} fontSize="sm">
                          {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                        </Text>
                      ))}
                    </VStack>
                  )}
                  <Badge colorScheme="green">Verified</Badge>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}

        <Heading size="md" mt={6}>Available Verifications</Heading>
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {providers.map((provider) => (
            <Box
              key={provider.id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              _hover={{ shadow: 'md' }}
            >
              <VStack spacing={4}>
                <Image
                  src={provider.logoUrl}
                  alt={provider.name}
                  boxSize="32px"
                />
                <VStack spacing={2} align="start">
                  <Text fontWeight="bold">{provider.name}</Text>
                  <Text fontSize="sm">{provider.description}</Text>
                </VStack>
                <Button
                  colorScheme="blue"
                  onClick={() => handleVerify(provider)}
                  isLoading={loading && selectedProvider?.id === provider.id}
                  w="full"
                >
                  Verify
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verification in Progress</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text>
                Complete the verification process in the new window. Once completed,
                click the button below to verify your data.
              </Text>
              <Button
                colorScheme="blue"
                onClick={handleVerificationComplete}
              >
                I've Completed Verification
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

// Export with no SSR
export const VerifiedDataSection = dynamic(
  () => Promise.resolve(VerifiedDataSectionComponent),
  { ssr: false }
);
