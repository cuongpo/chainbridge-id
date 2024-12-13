import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Text,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR for components that need browser APIs
const EmailLoginForm = ({ onSuccess }: { onSuccess: (address: string) => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [verificationCode, setVerificationCode] = useState('');
  const toast = useToast();

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      // Generate a random verification code (in production, this should be sent via email)
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Verification code:', code); // For testing purposes
      
      // In production, integrate with actual email service
      toast({
        title: 'Verification code sent',
        description: 'Check your email for the verification code',
        status: 'success',
        duration: 5000,
      });
      
      setStep('verify');
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast({
        title: 'Error',
        description: 'Failed to send verification code',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      toast({
        title: 'Invalid code',
        description: 'Please enter the verification code',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      // In production, verify the code with your backend
      // For now, we'll create a deterministic wallet based on email
      const wallet = ethers.Wallet.createRandom();
      onSuccess(wallet.address);
      
      toast({
        title: 'Success',
        description: 'Email verified successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify code',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <VStack spacing={4} w="full">
        <Text>Enter the verification code sent to {email}</Text>
        <FormControl>
          <FormLabel>Verification Code</FormLabel>
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
          />
        </FormControl>
        <Button
          colorScheme="blue"
          onClick={handleVerify}
          isLoading={loading}
          w="full"
        >
          Verify Code
        </Button>
        <Button
          variant="ghost"
          onClick={() => setStep('input')}
          size="sm"
        >
          Back to Email Input
        </Button>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} w="full">
      <FormControl>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </FormControl>
      <Button
        colorScheme="blue"
        onClick={handleSendCode}
        isLoading={loading}
        w="full"
      >
        Send Verification Code
      </Button>
    </VStack>
  );
};

// Export the component with no SSR
export default dynamic(() => Promise.resolve(EmailLoginForm), { ssr: false });
