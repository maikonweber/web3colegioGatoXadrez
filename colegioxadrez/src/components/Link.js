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
    <BreadcrumbLink href='CreateItem'>Home</BreadcrumbLink>
  </BreadcrumbItem>

  <BreadcrumbItem>
    <BreadcrumbLink href='#'>About</BreadcrumbLink>
  </BreadcrumbItem>

  <BreadcrumbItem isCurrentPage>
    <BreadcrumbLink href='/dashboard'>Contact</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
    )
}

export default linker;