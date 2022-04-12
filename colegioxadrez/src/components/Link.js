import {Flex, BreadcrumbDivider, Heading, Breadcrumb, BreadcrumbItem , BreadcrumbLink } from '@chakra-ui/react';
import Link from 'next/link';

const linker = (props) => {
    return (
<Breadcrumb
    height={10}
    spacing={4}
    separator = ""
    fontWeight="bold"
    fontSize="sm"
    color="black"
    alignItems="center"
>
  <BreadcrumbItem>
    <Link href='CreateItem'>Home</Link>
  </BreadcrumbItem>

  <BreadcrumbItem>
    <Link href='#'>About</Link>
  </BreadcrumbItem>

  <BreadcrumbItem isCurrentPage>
    <Link href='/Dashboard'>Contact</Link>
  </BreadcrumbItem>
</Breadcrumb>
    )
}

export default linker;