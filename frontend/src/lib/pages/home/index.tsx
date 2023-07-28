'use client'

import { Button, Flex, Heading } from '@chakra-ui/react';
import { useState } from 'react';

import AnyUpload from '~/lib/components/AnyUpload';

const Home = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <Heading as="h1" size="xl">
        Chat with Anything
      </Heading>
      <AnyUpload />
    </Flex>
  );
};

export default Home;
