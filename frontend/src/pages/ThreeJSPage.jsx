import React, { useRef, useEffect, useState } from 'react'
import { Box, Center, Container, Spacer, Divider, HStack, Stack, Flex, Link, Text, VStack, Select, Button, Image, Heading } from '@chakra-ui/react';
import ThreeJSViewer from '../components/ThreejsViewer.jsx';

export const ThreeJSPage = () => {
    
    return (
        <>
            <Container maxW="container.xl" py={5}>
                {/* The outer box handles layout positioning */}

                <Box p={5}
                    bg={'black'}
                    w={'100 %'}
                    fontFamily="monospace"
                    color="green.500"
                    letterSpacing={'widest'}
                    border="2px solid transparent"
                    transition="all 0.4s ease"
                    m={-3.5}
                    >
                    <Heading as='h2' size='lg' mb={5} mt={2} color={'yellow'} >
                        THREE JS
                    </Heading>
                    <ThreeJSViewer></ThreeJSViewer>
                    <Box mt={10} fontSize={17}>A WebGL-powered JavaScript library used to build immersive, interactive 3D graphics, models, and visual experiences directly in the browser. </Box>
                    <HStack align="start" w='full' fontSize={17}>
                        <Link href={"https://threejs.org/"} isExternal color="blue.500">
                            {"https://threejs.org/"}
                        </Link>
                    </HStack>
                </Box>

            </Container >
        </>
    );
};