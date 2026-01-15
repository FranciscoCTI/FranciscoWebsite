import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Container, Heading, HStack, VStack,
    IconButton, Text, useColorModeValue, Image,
    useToast, Modal, useDisclosure, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, Input, ModalFooter, Button, Select, Wrap,
    Stack, ChakraProvider, StatNumber, Link, Flex
} from '@chakra-ui/react';
import { useProjectStore } from '../store/project';
import { useEmployerStore } from '../store/employer';
import Gallery from './Gallery';
import ProjectInformation from './ProjectInformation';

const EmployerCard = ({ employer }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [updatedEmployer, setUpdatedEmployer] = useState(employer);

    const { fetchEmployers, removeEmployer } = useEmployerStore();

    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [contact, setContact] = useState('');
    const [contactPhoneNumber, setContactPhoneNumber] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [website, setWebsite] = useState('');

    const employerName = employer?.name;

    const { projects, fetchProjects } = useProjectStore();

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleModalClose = () => {
        setUpdatedEmployer(employer);
        onClose();
    };

    const handleRemoveEmployer = () => {

        removeEmployer(employer._id);
        console.log(employer.name + "Has been removed from db");
        fetchEmployers();
    };

    const handleModalOpen = () => {
        setUpdatedEmployer(employer);
        onOpen();
    };

    console.log("📌 Projects fetched:", projects);

    const filteredProjects = projects.filter((proj) => proj.companyId == employer._id);

    console.log("📌 Projects from this employer:", filteredProjects);

    return (
        <>
            <ChakraProvider>
                <Box fontFamily={'monospace'}
                    bg={'black'}
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
                        <Button colorScheme="red" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveEmployer(employer._id);
                        }}>
                            Remove
                        </Button>
                    </Flex>
                    <VStack>
                        <HStack align="start" w='full'>
                            <Text fontSize='s' mb={0}>
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
                        p={{ base: 2, md: 4 }}>
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
            </ChakraProvider>
        </>
    )
};

export default EmployerCard