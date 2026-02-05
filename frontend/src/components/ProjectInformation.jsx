import React from 'react'
import Gallery from './Gallery'
import {
    VStack, HStack, Box, Button, useColorModeValue, useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, Input, ModalFooter, ChakraProvider, Text,
    Center
} from '@chakra-ui/react'

const ProjectInformation = ({ project }) => {
    return (
        <>
            <ChakraProvider>
                <Box fontFamily={'monospace'} margin={1} border={'2px solid black'} p={4}>
                    <VStack spacing={3} align={'flex-start'}>
                        <Text fontSize={25}>{project.title}</Text>
                        <HStack w={'100%'}>
                            <Text flex={1} fontWeight={'bold'}>Year: </Text>
                            <Text flex={5}>{project.year}</Text>
                        </HStack>
                        <HStack align={'start'} w={'100%'}>
                            <Text flex={1} fontWeight={'bold'}>Description: </Text>
                            <Text flex={5}>{project.description}</Text>
                        </HStack>
                        <HStack align={'start'} w={'100%'}>
                            <Text flex={1} fontWeight={'bold'}>My role: </Text>
                            <Text flex={5}>{project.myRoleOnIt}</Text>
                        </HStack>
                    </VStack>
                    <Gallery project={project}></Gallery>
                </Box>
            </ChakraProvider>
        </>
    )
}

export default ProjectInformation