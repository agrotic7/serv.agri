import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <Box as="nav" bg="white" boxShadow="sm" py={4}>
      <Flex maxW="1200px" mx="auto" px={4} justify="space-between" align="center">
        <Link to="/">
          <Text fontSize="xl" fontWeight="bold">Logo</Text>
        </Link>
        <Flex gap={6}>
          <Link to="/">Accueil</Link>
          <Link to="/about">À propos</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar; 