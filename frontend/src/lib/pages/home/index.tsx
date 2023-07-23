'use client'

import { Button, Flex, Heading } from '@chakra-ui/react';
// import { initializeApp } from 'firebase/app';
// import { NextSeo } from 'next-seo';
import { useState } from 'react';
// import { UploadService } from '~/client';

import AnyUpload from '~/lib/components/AnyUpload';

const Home = () => {
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [isLoading, setIsLoading] = useState(false);

  // const fileToBlob = async (file: File) =>
  //   new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type });

  // const handleUpload = async () => {
  //   if (!selectedFile) return;

  //   setIsLoading(true);
  //   const blob = await fileToBlob(selectedFile);
  //   await UploadService.createUploadFile({
  //     file: blob,
  //   });
  //   setIsLoading(false);
  // };

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
      {/* <NextSeo title="Chat with Anything" /> */}
      <AnyUpload />
    </Flex>
  );
};

export default Home;
