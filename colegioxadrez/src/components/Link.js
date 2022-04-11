import Flex from '@chakra-ui/react';
import Link from 'next/link';

const linker = (props) => {
    return (
       <Flex 
         width='100vw'
        height='80px'

       >
             <ul>
                    <li>
                        <Link href='/'>
                            <a>Home</a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/create-item'>
                            <a>Create Item</a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/my-items'>
                            <a>My Items</a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/dashboard'>
                            <a>Market</a>
                        </Link>
                    </li>
             </ul>
       </Flex>

    )
}

export default linker;