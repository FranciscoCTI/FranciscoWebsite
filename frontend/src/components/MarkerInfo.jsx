import React from 'react'
import {
    VStack, HStack, Text, Box, useColorModeValue, Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Center,
    Button
} from '@chakra-ui/react'
import { CloseButton } from '@chakra-ui/react';

function MarkerInfo({ item, closeHandler }) {
    return (
        <div>
            <Box bg="white"
                position='absolute'
                transform="translate(-50%)" padding={2}
                fontWeight={'bold'}
                fontFamily={'monospace'}>
                <VStack>
                    <HStack spacing={2}>
                        <Box fontSize="sm"
                            color="black"
                            whiteSpace="nowrap"
                            padding={1}>
                            {item.title}
                        </Box>
                        <CloseButton size={'sm'}
                            _hover={{ bg: "gray.100" }}
                            onClick={() => closeHandler()} />
                    </HStack>
                    <Flex justify="flex-end" w="100%">
                        <Button colorScheme="blue" size="sm">More info</Button>
                    </Flex>
                </VStack>
            </Box>
        </div>
    )
}


export default MarkerInfo;
