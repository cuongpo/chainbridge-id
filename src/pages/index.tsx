import { Box, Container, Heading, Text, VStack, Button, useToast, Center, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useAuth } from '../hooks/useAuth';

// Import EmailLoginForm with no SSR
const EmailLoginForm = dynamic(() => import('../components/EmailLoginForm'), {
  ssr: false,
});

export default function Home() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { login, loading, isAuthenticated, initialized } = useAuth();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (initialized && isAuthenticated && !loading) {
      router.replace('/dashboard');
    }
  }, [initialized, isAuthenticated, loading, router]);

  const handleSuccess = async (address: string) => {
    try {
      await login(address);
      toast({
        title: 'Welcome!',
        description: 'You have successfully logged in',
        status: 'success',
        duration: 3000,
      });
      setShowEmailForm(false);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to complete login',
        status: 'error',
        duration: 3000,
      });
    }
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

  if (isAuthenticated) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="center">
        <Heading as="h1" size="2xl">ChainBridge ID</Heading>
        <Text fontSize="xl" textAlign="center">
          Your unified identity solution for seamless cross-chain interactions
        </Text>
        
        <Box w="full" maxW="md" p={8} borderWidth={1} borderRadius="lg">
          <VStack spacing={4}>
            {showEmailForm ? (
              <EmailLoginForm onSuccess={handleSuccess} />
            ) : (
              <>
                <Button
                  w="full"
                  colorScheme="blue"
                  onClick={() => setShowEmailForm(true)}
                  isLoading={loading}
                >
                  Login with Email
                </Button>
                <Button
                  w="full"
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: 'Coming soon',
                      description: 'Social login will be implemented soon',
                      status: 'info',
                      duration: 3000,
                    });
                  }}
                >
                  Login with Social
                </Button>
              </>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
