import {
  Box,
  VStack,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { CheckCircleIcon, TimeIcon, WarningIcon } from '@chakra-ui/icons';

interface Transaction {
  id: string;
  fromChain: string;
  toChain: string;
  type: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: number;
}

interface CrossChainActivityProps {
  transactions: Transaction[];
}

export function CrossChainActivity({ transactions }: CrossChainActivityProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircleIcon;
      case 'pending':
        return TimeIcon;
      case 'failed':
        return WarningIcon;
      default:
        return CheckCircleIcon;
    }
  };

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" bg="white">
      <VStack spacing={6} align="stretch">
        <Heading size="md">Cross-Chain Activity</Heading>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((tx) => (
                <Tr key={tx.id}>
                  <Td>
                    <Text fontWeight="medium">{tx.type}</Text>
                  </Td>
                  <Td>
                    <Badge colorScheme="purple">{tx.fromChain}</Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme="blue">{tx.toChain}</Badge>
                  </Td>
                  <Td>{tx.amount}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Icon
                        as={getStatusIcon(tx.status)}
                        color={`${getStatusColor(tx.status)}.500`}
                      />
                      <Tooltip
                        label={`Transaction ${tx.status} at ${new Date(
                          tx.timestamp
                        ).toLocaleString()}`}
                      >
                        <Badge colorScheme={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                      </Tooltip>
                    </HStack>
                  </Td>
                  <Td>
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
}
