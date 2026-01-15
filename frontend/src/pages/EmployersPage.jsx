import { React, useState, useEffect } from 'react'
import { useEmployerStore } from '../store/employer';
import {
    VStack, Container, Text, SimpleGrid, useColorModeValue, Button, Modal, useDisclosure, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton, Box,
    ModalBody, Input, ModalFooter,
    HStack
} from '@chakra-ui/react'
import EmployerCard from '../components/EmployerCard';
import { createEmployer } from '../../../backend/controllers/employer.controller';
import Employer from '../../../backend/models/employer.model';
import { Switch } from "@chakra-ui/react";

const EmployersPage = () => {

    const text = useColorModeValue("black.800", "yellow.300"); // light / dark text

    console.log("Started rendering EmployersPage");

    const { employers, fetchEmployers, createEmployer } = useEmployerStore();

    console.log("📌 Employers in store previous to fetch:", employers);

    useEffect(() => {
        fetchEmployers();
    }, []);

    const [newEmployer, setNewEmployer] = useState({
        name: "",
        city: "",
        country: "",
        contact: "",
        contactPhoneNumber: 12345,
        isCurrent: false,
        website: "",
    });

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleModalClose = () => {
        onClose();
    };

    const [active, setActive] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);

    const handleAddEmployer = async () => {

        const formData = new FormData();
        formData.append("name", newEmployer.name);
        formData.append("city", newEmployer.city);
        formData.append("country", newEmployer.country);
        formData.append("contact", newEmployer.contact);
        formData.append("contactPhoneNumber", newEmployer.contactPhoneNumber);
        formData.append("isCurrent", active);
        formData.append("website", newEmployer.website);
        formData.append("image", selectedFile);

        const updatedEmployer = { ...newEmployer, isCurrent: active };

        setNewEmployer(updatedEmployer);

        const { success, message } = await createEmployer(formData);

        console.log("Success:", success);
        console.log("Message", message);

        setNewEmployer({
            name: 'New employer',
            city: '',
            country: '',
            contact: '',
            contactPhoneNumber: 123,
            isCurrent: false,
            website: ''
        })

        onClose();
    };

    return (
        <>
            <Container maxW='container.xl' py={3}>
                <VStack spacing={6}>
                    <Text my={10}
                        fontSize={'30'}
                        fontWeight={'bold'}
                        fontFamily={'monospace'}
                        color={text}
                        textAlign={'center'}
                    >
                        These are all the employers that I´ve had
                    </Text>
                    <SimpleGrid
                        columns={{ base: 1, sm: 2, md: 3 }}
                        spacing={10}
                    >
                        {employers.map((emp) => (
                            (emp != null && emp.name != "") &&
                            (<EmployerCard key={emp._id} employer={emp} />)
                        ))
                        }
                    </SimpleGrid>
                    <Button borderRadius={0} onClick={onOpen}>Add new employer</Button>
                    {
                        employers.length === 0 &&
                        (
                            <Text fontSize='x1' textAlign={'center'} fontWeight={'bold'} color='gray.500'>
                                No employers found :( {''}
                            </Text>
                        )
                    }
                </VStack>
            </Container>

            <Modal isOpen={isOpen} onClose={handleModalClose} isCentered={true} fontFamily={'monospace'}>
                <ModalOverlay bg={"blackAlpha.600"} />
                <ModalContent maxW={{ base: "90%", md: "600px" }}
                    borderRadius="none"
                    boxShadow="xl"
                    p={{ base: 2, md: 4 }}>
                    <ModalHeader textAlign={'center'} fontFamily={'monospace'} fontSize={27}>Adding new employer</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box fontFamily={'monospace'} fontSize={13} p={3}>
                            <VStack spacing={3}>
                                <Input placeholder='Employer name'
                                    name='name'
                                    value={newEmployer.name}
                                    onChange={(e) => setNewEmployer({ ...newEmployer, name: e.target.value })}
                                />
                                <Input placeholder='City'
                                    name='city'
                                    value={newEmployer.city}
                                    onChange={(e) => setNewEmployer({ ...newEmployer, city: e.target.value })}
                                />

                                <Input placeholder='Country'
                                    name='country'
                                    value={newEmployer.country}
                                    onChange={(e) => setNewEmployer({ ...newEmployer, country: e.target.value })}
                                />

                                <Input placeholder='Contact'
                                    name='country'
                                    value={newEmployer.contact}
                                    onChange={(e) => setNewEmployer({ ...newEmployer, contact: e.target.value })}
                                />

                                <Input
                                    type="tel"
                                    value={newEmployer.contactPhoneNumber}
                                    onChange={(e) => setNewEmployer({ ...newEmployer, contactPhoneNumber: Number(e.target.value.replace(/\D/g, "")) })}
                                    placeholder="+56 9 1234 5678"
                                />

                                <HStack><Text>Is active job: </Text>
                                    <Switch
                                        isChecked={active}
                                        onChange={(e) => {
                                            setActive(e.target.checked);
                                        }}
                                    />
                                </HStack>

                                <Input placeholder='Website'
                                    name='Website'
                                    value={newEmployer.website}
                                    onChange={(e) => setNewEmployer({ ...newEmployer, website: e.target.value })}
                                />

                                <input type="file"
                                    accept='image/*'
                                    onChange={(e) => setSelectedFile(e.target.files[0])}>

                                </input>

                                <Button colorScheme='blue' onClick={handleAddEmployer} w='full'>
                                    Add
                                </Button>
                            </VStack>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default EmployersPage