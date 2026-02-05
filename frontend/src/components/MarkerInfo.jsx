import React, { useState, useEffect } from 'react'
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
import { useProjectStore } from '../store/project';
import { useEmployerStore } from '../store/employer';

function MarkerInfo({ item, closeHandler }) {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [project, setProject] = useState(item);

    const { projects, fetchProjects, createProject, removeProject } = useProjectStore();

    const { employers, fetchEmployers } = useEmployerStore();

    const getCompanyNameById = (id) =>
        employers.find(e => e._id === id)?.name ?? "Unknown company";

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleModalClose = () => {
        onClose();
    };

    const handleMoreInfoClick = () => {
        setProject(item);
        onOpen();
    };

    const handleRemoveProject = () => {
        removeProject(project._id);
    };

    return (
        <div>
            <Box bg="white"
                position='absolute'
                transform="translate(-50%)" padding={2}
                fontWeight={'bold'}
                fontFamily={'monospace'}
                fontSize={20}>
                <VStack align={'end'}>
                    <HStack spacing={2} align={'left'}>
                        <Box fontSize="20px"
                            color="black"
                            whiteSpace="nowrap"
                            padding={1}>
                            {project.title}
                        </Box>
                        <CloseButton size={'sm'}
                            _hover={{ bg: "gray.100" }}
                            onClick={() => closeHandler()} />
                    </HStack>
                    <Flex justify="flex-end" w="100%" p={1}
                    >
                        <Button m={0.5}
                            colorScheme="blue"
                            size="xs"
                            onClick={
                                handleMoreInfoClick
                            }
                        >More info</Button>
                        <Button m={0.5} colorScheme="yellow" size="xs" onClick={handleMoreInfoClick}>Edit</Button>
                        <Button m={0.5} colorScheme="red" size="xs" onClick={handleRemoveProject}>Remove</Button>
                    </Flex>
                </VStack>
            </Box>

            <Modal isOpen={isOpen}
                onClose={handleModalClose}
                isCentered={true}
                fontFamily={'monospace'}
            >
                <ModalOverlay bg={"blackAlpha.600"} />
                <ModalContent maxW={{ base: "90%", md: "600px" }}
                    borderRadius="none"
                    boxShadow="xl"
                    p={{ base: 2, md: 4 }} bg={'white'}>
                    <ModalHeader textAlign={'center'} fontFamily={'monospace'} fontSize={27}>{project.title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box fontFamily={'monospace'} fontSize={13} p={1}>
                            <VStack spacing={3} align={'start'}>
                                <Box p={3} bg={'black'} w={'full'} fontSize={15}>
                                    <HStack p={'2'} align={'center'}>
                                        <Text color={'yellow'} fontSize={25}>
                                            Year:
                                        </Text>
                                        <Text color={'yellow'} >
                                            {project.year}
                                        </Text>
                                    </HStack>
                                    <HStack p={2} align={'center'}>
                                        <Text f color={'yellow'} m={0} fontSize={25}>
                                            Type:
                                        </Text>
                                        <Text color={'yellow'} >
                                            {project.type}
                                        </Text>
                                    </HStack>
                                    <HStack p={2} align={'start'}>
                                        <Text f color={'yellow'} m={0} fontSize={25}>
                                            Description:
                                        </Text>
                                        <Text color={'yellow'} >
                                            {project.description}
                                        </Text>
                                    </HStack>
                                    <HStack p={2} align={'start'}>
                                        <Text color={'yellow'} m={0} fontSize={25}>
                                            My role on this project:
                                        </Text>
                                        <Text color={'yellow'}>
                                            {project.myRoleOnIt}
                                        </Text>
                                    </HStack>
                                    <HStack p={2} align={'center'}>
                                        <Text color={'yellow'} m={0} fontSize={25}>
                                            Company:
                                        </Text>
                                        <Text color={'yellow'}>
                                            {getCompanyNameById(project.companyId)}
                                        </Text>
                                    </HStack>
                                    <img src={`http://localhost:5000/uploads/${project.image}`} style={{ padding: 7, width: "100%", height: "auto", objectFit: "contain" }}></img>
                                </Box>
                            </VStack>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}


export default MarkerInfo;
