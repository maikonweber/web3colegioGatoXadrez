import { Box, Flex, Image } from '@chakra-ui/react'

const Header = (props) => {
    return (   
        <> 
        <Flex 
        bg='red.700'
        width='100%'
        height={['50px', '50px', '50px', '50px', '50px']}
        alignItems='center'
        justifyContent='center'
        boxShadow={'xl'}
        borderRadius={1}
        >  
        </Flex>
        <Flex
        width='100%'
        height={['110px', '110px', '110px', '110px', '110px']}
        alignItems='center'
        justifyContent='center'
        bg='white'
        boxShadow={'xl'}
        borderRadius={1}
        position='relative'
        >
        <Image src='/logo.png' ></Image>
        </Flex>        
        </>
    )
       
}

export default Header;