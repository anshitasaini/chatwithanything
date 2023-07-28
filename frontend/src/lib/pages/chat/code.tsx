import React, { useEffect, useState } from 'react';
import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import Chat from '~/lib/components/Chat';
import { CodeBlock, dracula } from "react-code-blocks";
import { useRouter, withRouter } from 'next/router'
import { UploadService } from '~/client/services/UploadService';
import { CodeService } from '~/client/services/CodeService';
import { RepoInfo } from '../../../client/models/RepoInfo';
import { chatInstructions } from './welcome';

const CodeChatPage: React.FC = (props) => {
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const router = useRouter();
  const [codeUrl, setCodeUrl] = useState<string | null>(null);

  const [codeContent, setCodeContent] = useState<string>(chatInstructions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { repoInfo } = await UploadService.uploadCode(router.query.repoUrl);
        setRepoInfo(repoInfo);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [router.query.repoUrl]);

  useEffect(() => {
    if (!codeUrl) return;
    CodeService.getFile(codeUrl).then((res) => {
      console.log(res);
      setCodeContent(res);
    })
  }, [codeUrl]);
  
  return (
    <Flex flexDirection="row">
      <Box flex="2" p={4} mr={4} maxWidth='950px'>
        <CodeBlock
          text={codeContent}
          language={'javascript'}
          showLineNumbers={true}
          theme={dracula} startingLineNumber={0} wrapLongLines={false}       
        />
      </Box>
      <Box flex="1">
        <Chat sourceId={repoInfo?.source_id} setCodeUrl={setCodeUrl}/>
      </Box>
    </Flex>
  );
};

export default withRouter(CodeChatPage);
