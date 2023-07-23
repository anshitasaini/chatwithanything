import { Box, Flex, Icon, Text, useColorMode } from '@chakra-ui/react';
import type React from 'react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
// import { FiUpload } from 'react-icons/fi';
import { FiPaperclip } from 'react-icons/fi';


interface Props {
  onFileUploaded: (file: File) => void;
}

const FileUpload: React.FC<Props> = ({ onFileUploaded }) => {
  const { colorMode } = useColorMode();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const fileUrl = URL.createObjectURL(file);

      setSelectedFileUrl(fileUrl);
      onFileUploaded(file);
    },
    [onFileUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  return (
    <label {...getRootProps()}>
      <input {...getInputProps()} style={{ display: 'none' }} />
      <Icon
        as={FiPaperclip}
        boxSize={4}
        color={isDragActive ? 'green.400' : colorMode === 'light' ? 'black' : 'white'}
        cursor="pointer"
      />
    </label>
  );
};

export default FileUpload;
