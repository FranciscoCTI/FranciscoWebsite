import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Container, Heading, HStack, VStack,
    IconButton, Text, Image,
    Modal, useDisclosure, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, Input, ModalFooter, Button, Select, Wrap,
    Stack, ChakraProvider, StatNumber, Link, Flex, Switch, useColorModeValue
} from '@chakra-ui/react';
import { useProjectStore } from '../store/project';
import { useEmployerStore } from '../store/employer';
import Gallery from './Gallery';
import ProjectInformation from './ProjectInformation';
import Employer from '../../../backend/models/employer.model';

const EmployerCard = ({ employer }) => {

    const backGroundColor = useColorModeValue('white', "gray.800");
    const intermediateColor = useColorModeValue('blue.100', "gray.500");
    const textColor = useColorModeValue("black", "yellow");
    const placeholderColor = useColorModeValue("gray.500", "yellow.600");

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();

    const [updatedEmployer, setUpdatedEmployer] = useState({});

    useEffect(() => {
        if (isOpenEdit && employer) {
            setUpdatedEmployer({ ...employer });   // initialize only once on open
        }
    }, [isOpenEdit]);

    const { fetchEmployers, removeEmployer, updateEmployer } = useEmployerStore();

    const [active, setActive] = useState(employer.isCurrent);

    const [selectedFile, setSelectedFile] = useState(null);

    const { projects, fetchProjects } = useProjectStore();

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleModalClose = () => {
        setUpdatedEmployer(employer);
        onClose();
    };

    const handleModalEditClose = () => {
        onCloseEdit();
    };

    const handleRemoveEmployer = () => {

        removeEmployer(employer._id);
        console.log(employer.name + "Has been removed from db");
        fetchEmployers();
    };

    const handleEditEmployer = () => {
        onOpenEdit();
        setSelectedFile(employer.image);

    };

    const handleModalOpen = () => {
        setUpdatedEmployer(employer);
        onOpen();
    };

    const handleFinishEditEmployer = async (id, updatedEmp) => {

        try {
            const formData = new FormData();

            for (const [key, value] of Object.entries(updatedEmp)) {
                if (key.toUpperCase() == "IMAGE") {
                    formData.append(key, selectedFile.name)
                }
                else {
                    formData.append(key, value);
                }
            }

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            await updateEmployer(id, formData);

            console.log(`Updated employer: ${employer.name}`);
            fetchEmployers();
            onCloseEdit();
        } catch (err) {
            console.error("Error updating employer", err);
        }
    };

    console.log("📌 Projects fetched:", projects);

    const filteredProjects = projects.filter((proj) => proj.companyId == employer._id);

    console.log("📌 Projects from this employer:", filteredProjects);

    return (
        <>
            <ChakraProvider>
                <Box fontFamily={'monospace'}
                    bg={intermediateColor}
                    borderRadius="0"
                    boxShadow="md"
                    p={4}
                    maxW="400px"
                    mx="1"
                    height={"auto"}
                    borderWidth={employer.isCurrent ? "6px" : "2px"}
                    borderColor={employer.isCurrent ? "orange" : "black"}
                    background={employer.isCurrent ? "lightgreen" : "black"}
                    color="green.500"
                    letterSpacing={'widest'}
                    fontSize={18}
                    _hover={{ transform: "translateY(-10px)", shadow: 'x1' }}
                    transition="all 0.4s ease"
                    onClick={handleModalOpen}>
                    <Flex align="center" justify="space-between" mb={2}>
                        <Heading as='h2' size='lg' mb={2} color={employer.isCurrent ? "green.700" : "yellow"} fontFamily={'monospace'} >
                            {employer.name}
                        </Heading>
                        <VStack>
                            <Button isDisabled bg={'red'} textColor={'White'} size="sm" onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveEmployer(employer._id);
                            }}>
                                Remove
                            </Button>
                            <Button bg={'yellow'} textColor={'Black'} size="sm" onClick={(e) => {
                                e.stopPropagation();
                                handleEditEmployer(employer._id);
                            }}>
                                Edit
                            </Button>
                        </VStack>
                    </Flex>
                    <VStack>
                        <HStack align="start" w='full'>
                            <Text fontSize='s' mb={0} color={employer.isCurrent ? 'Black' : 'yellow'}>
                                {employer.city} - {employer.country}
                            </Text>
                        </HStack>
                        <img src={`http://localhost:5000/uploads/${employer.image}`} style={{ width: "350px", height: "300px", objectFit: "contain" }}></img>
                    </VStack>
                </Box>

                <Modal isOpen={isOpen} onClose={handleModalClose} isCentered={true} fontFamily={'monospace'}>
                    <ModalOverlay bg={"blackAlpha.600"} />
                    <ModalContent maxW={{ base: "90%", md: "600px" }}
                        borderRadius="none"
                        boxShadow="xl"
                        p={{ base: 2, md: 4 }}
                        borderWidth={10}
                        borderColor={'black'}>

                        <ModalHeader textAlign={'center'} fontFamily={'monospace'} fontSize={27}>{updatedEmployer.name}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box fontFamily={'monospace'} fontSize={13}>
                                <VStack spacing={3} align={'flex-start'}>
                                    <HStack w={'100%'} align={'start'}>
                                        <Text flex={1} fontWeight={'bold'}>City: </Text>
                                        <Text flex={5}>{updatedEmployer.city}</Text>
                                    </HStack>
                                    <HStack align={'start'} w={'100%'}>
                                        <Text flex={1} fontWeight={'bold'}>Country: </Text>
                                        <Text flex={5}>{updatedEmployer.country}</Text>
                                    </HStack>
                                    <HStack align={'start'} w={'100%'} >
                                        <Text flex={1} fontWeight={'bold'}>Contact: </Text>
                                        <Text flex={5}>{updatedEmployer.contact}</Text>
                                    </HStack>
                                    <HStack align={'start'} w={'100%'}>
                                        <Text flex={1} fontWeight={'bold'}>Phone: </Text>
                                        <Text flex={5}>{updatedEmployer.contactPhoneNumber}</Text>
                                    </HStack>
                                    <HStack align={'start'} w={'100%'}>
                                        <Text flex={1} fontWeight={'bold'}>Website: </Text>
                                        <Link flex={5} href={updatedEmployer.website} isExternal color={'blue.500'}>{updatedEmployer.website}</Link>
                                    </HStack>
                                </VStack>
                            </Box>
                            <Text fontWeight={'bold'} fontFamily={'monospace'} mt={7} fontSize={22}>Projects worked for this company:</Text>
                            <VStack spacing={6} align={'stretch'}>
                                {filteredProjects.map((proj) => (
                                    <ProjectInformation project={proj}></ProjectInformation>
                                ))};
                            </VStack>
                            {filteredProjects.length == 0 && <Box fontFamily={'monospace'}>No projects for this employer yet</Box>}
                        </ModalBody>
                    </ModalContent>
                </Modal>

                <Modal isOpen={isOpenEdit} onClose={handleModalEditClose} isCentered={true} fontFamily={'monospace'}>
                    <ModalOverlay bg={"blackAlpha.600"} />
                    <ModalContent maxW={{ base: "90%", md: "600px" }}
                        borderRadius="none"
                        boxShadow="xl"
                        p={{ base: 2, md: 4 }}>
                        <ModalHeader textAlign={'center'} fontFamily={'monospace'} fontSize={27}>{updatedEmployer.name}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box fontFamily={'monospace'} fontSize={13}>
                                <VStack spacing={3} align={'flex-start'}>
                                    <Input placeholder='Employer name'
                                        name='name'
                                        value={updatedEmployer.name || ""}
                                        onChange={(e) => setUpdatedEmployer({ ...updatedEmployer, name: e.target.value })}
                                    />
                                    <Input placeholder='City'
                                        name='city'
                                        value={updatedEmployer.city}
                                        onChange={(e) => setUpdatedEmployer({ ...updatedEmployer, city: e.target.value })}
                                    />

                                    <Input placeholder='Country'
                                        name='country'
                                        value={updatedEmployer.country}
                                        onChange={(e) => setUpdatedEmployer({ ...updatedEmployer, country: e.target.value })}
                                    />

                                    <Input placeholder='Contact'
                                        name='country'
                                        value={updatedEmployer.contact}
                                        onChange={(e) => setUpdatedEmployer({ ...updatedEmployer, contact: e.target.value })}
                                    />

                                    <Input
                                        type="tel"
                                        value={updatedEmployer.contactPhoneNumber}
                                        onChange={(e) => setUpdatedEmployer({ ...updatedEmployer, contactPhoneNumber: Number(e.target.value.replace(/\D/g, "")) })}
                                        placeholder="+56 9 1234 5678"
                                    />

                                    <HStack><Text>Is active job: </Text>
                                        <Switch
                                            isChecked={active}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setActive(checked);
                                                setUpdatedEmployer({
                                                    ...updatedEmployer,
                                                    isCurrent: checked
                                                });
                                            }}
                                        />
                                    </HStack>

                                    <Input placeholder='Website'
                                        name='Website'
                                        value={updatedEmployer.website}
                                        onChange={(e) => setUpdatedEmployer({ ...updatedEmployer, website: e.target.value })}
                                    />

                                    <input type="file"
                                        accept='image/*'
                                        onChange={(e) => setSelectedFile(e.target.files[0])}>
                                    </input>

                                    <Button colorScheme='blue' onClick={() => handleFinishEditEmployer(updatedEmployer._id, updatedEmployer)} w='full'>
                                        Edit
                                    </Button>
                                </VStack>
                            </Box>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </ChakraProvider>
        </>
    )
};

export default EmployerCard