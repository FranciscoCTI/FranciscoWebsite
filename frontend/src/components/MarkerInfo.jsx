import React, { useState } from 'react'
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

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [project, setProject] = useState(item);

    const handleModalClose = () => {
        onClose();
    };

    const handleMoreInfoClick = () => {
        setProject(item);
        onOpen();
    };

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
                            {project.title}
                        </Box>
                        <CloseButton size={'sm'}
                            _hover={{ bg: "gray.100" }}
                            onClick={() => closeHandler()} />
                    </HStack>
                    <Flex justify="flex-end" w="100%">
                        <Button colorScheme="blue" size="sm" onClick={handleMoreInfoClick}>More info</Button>
                    </Flex>
                </VStack>
            </Box>

            <Modal isOpen={isOpen} onClose={handleModalClose} isCentered={true} fontFamily={'monospace'}>
                <ModalOverlay bg={"blackAlpha.600"} />
                <ModalContent maxW={{ base: "90%", md: "600px" }}
                    borderRadius="none"
                    boxShadow="xl"
                    p={{ base: 2, md: 4 }}>
                    <ModalHeader textAlign={'center'} fontFamily={'monospace'} fontSize={27}>Project information</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box fontFamily={'monospace'} fontSize={13} p={3}>
                            <VStack spacing={3}>
                                <Text color={'blue'}>
                                    {project.title}
                                </Text>
                            </VStack>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}


export default MarkerInfo;
