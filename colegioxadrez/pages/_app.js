
import { ChakraProvider } from '@chakra-ui/react';
import theme  from "../config/config";
import Headers from '../src/components/Header';
import Image from 'next/image';


function MyApp({ Component, pageProps }) {
  return (<>

 <ChakraProvider theme={theme} >
<Headers />
  <Component {...pageProps} />
  </ChakraProvider >

  </>
  );
}

export default MyApp
