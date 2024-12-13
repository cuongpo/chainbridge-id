import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { WagmiConfig, createConfig } from 'wagmi';

const config = createConfig({
  // Add configuration as needed
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </WagmiConfig>
  );
}

export default MyApp;
