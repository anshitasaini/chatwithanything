import { Flex, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Flex as="footer" width="full" justifyContent="center">
      <Text fontSize="sm">{new Date().getFullYear()} - Chat with Anything</Text>
    </Flex>
  );
};

export default Footer;
