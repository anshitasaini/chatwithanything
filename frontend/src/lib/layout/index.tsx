import { Box, useBreakpointValue } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import Footer from './Footer';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const maxWidth = useBreakpointValue({ base: "100%", sm: "100%", md: "1000px", lg: "1200px" });

  return (
    <Box margin="0 auto" maxWidth={maxWidth} transition="0.5s ease-out">
      <Box margin="8">
        <Header />
        <Box as="main" marginY={22}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
