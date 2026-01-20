import { React, useState, useEffect } from 'react'
import {
    Box, Container, Heading, HStack, VStack,
    IconButton, Text, Image,
    Modal, useDisclosure, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, Input, ModalFooter, Button, Select, Wrap,
    Stack, Link, Spacer, Collapse
} from '@chakra-ui/react';
import { useTechnologyStore } from '../store/technology';

const TechnologyCard = ({ technology }) => {

    var techName = technology.name;
    techName = techName.replace("#", "");

    const { isOpen, onToggle } = useDisclosure();

    const [updatedTechnology, setUpdatedTechnology] = useState({ technology });

    const { isOpen: cardOpen, onOpen: cardOpening, onClose: cardClosing } = useDisclosure();

    const { fetchTechnologies, updateTechnology } = useTechnologyStore();

    const HandleEditTecnology = () => {
        cardOpening();
    };

    useEffect(() => {
        if (cardOpen && technology) {
            setUpdatedTechnology({ ...technology });   // initialize only once on open
        }
    }, [cardOpen]);

    const handleFinishEditTechnology = async (id, updatedTech) => {

        try {
            await updateTechnology(id, updatedTech);

            console.log(`Updated employer: ${technology.name}`);
            fetchTechnologies();
            cardClosing();
        } catch (err) {
            console.error("Error updating employer", err);
        }
    };

    const years = [];
    for (let y = 1950; y <= new Date().getFullYear(); y++) {
        years.push(y);
    }

    return (<>
        <Box p={4}
            bg={'black'}
            w={'full'}
            fontFamily="monospace"
            color="green.500"
            letterSpacing={'widest'}
            border="2px solid transparent"
            _hover={{
                transform: "translateY(-10px)",
                shadow: 'x1',
                borderColor: "black",
                borderWidth: "20px",
                background: "gray.900"
            }}
            transition="all 0.4s ease">
            <Heading as='h2' size='lg' mb={2} color={'yellow'} >
                {technology.name}
            </Heading>
            <HStack>
                <VStack>
                    <HStack align="start" w='full'>
                        <Text fontSize={20}>{"Used in: " + technology.usedIn}</Text>
                    </HStack>
                    <HStack align="start" w='full'>
                        <Text fontSize={20}>{"Year: " + technology.year}</Text>
                    </HStack>
                    <HStack align="start" w='full'>
                        <Text fontSize={20} >{"My user level: " + technology.userLevel}</Text>
                    </HStack>
                    <HStack align="start" w='full'>
                        <Link fontSize={20} href={technology.website} isExternal color="blue.500">
                            {technology.website}
                        </Link>
                    </HStack>
                </VStack>
                <Spacer></Spacer>
                <VStack>
                    <img src={"/" + techName + ".png"} style={{ width: "150px", height: "150px", objectFit: "contain" }}></img>
                    <Button colorScheme="red" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        HandleEditTecnology(technology._id);
                    }}>Edit</Button>
                </VStack>
            </HStack>
            <Button onClick={onToggle} size="lg" mt={5} colorScheme="yellow" variant="outline">
                {isOpen ? 'Yeah yeah, just close it' : 'Interesting , let´s see more'}
            </Button>
            <Collapse in={isOpen} animateOpacity>
                <Box mt={2} p={1} bg="gray.800">
                    <Text fontSize={18}>
                        {technology.description || 'No additional description available.'}
                    </Text>
                </Box>
            </Collapse>
        </Box>
        <Modal isOpen={cardOpen} onClose={cardClosing} isCentered={true} fontFamily={'monospace'}>
            <ModalOverlay bg={"blackAlpha.600"} />
            <ModalContent maxW={{ base: "90%", md: "600px" }}
                borderRadius="none"
                boxShadow="xl"
                p={{ base: 2, md: 4 }}>
                <ModalHeader textAlign={'center'} fontFamily={'monospace'} fontSize={27}>{updatedTechnology.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box fontFamily={'monospace'} fontSize={13}>
                        <VStack spacing={3} align={'flex-start'}>
                            <Input placeholder='Tech name'
                                name='name'
                                value={updatedTechnology.name || ""}
                                onChange={(e) => setUpdatedTechnology({ ...updatedTechnology, name: e.target.value })}
                            />

                            <Input placeholder='Usage'
                                name='used in'
                                value={updatedTechnology.usedIn || ""}
                                onChange={(e) => setUpdatedTechnology({ ...updatedTechnology, usedIn: e.target.value })}
                            />

                            <Select value={updatedTechnology.year || ""} onChange={(e) => setUpdatedTechnology({ ...updatedTechnology, year: e.target.value })} maxHeight={"150px"} overflowY={"auto"}>
                                <option value="">Select year</option>
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </Select>

                            <Input placeholder='User level'
                                name='user level'
                                value={updatedTechnology.userLevel || ""}
                                onChange={(e) => setUpdatedTechnology({ ...updatedTechnology, userLevel: e.target.value })}
                            />

                            <Input placeholder='Website'
                                name='website'
                                value={updatedTechnology.website || ""}
                                onChange={(e) => setUpdatedTechnology({ ...updatedTechnology, website: e.target.value })}
                            />

                            <Input placeholder='Description'
                                name='description'
                                value={updatedTechnology.description || ""}
                                onChange={(e) => setUpdatedTechnology({ ...updatedTechnology, description: e.target.value })}
                            />

                            <Button colorScheme='blue' onClick={() => handleFinishEditTechnology(updatedTechnology._id, updatedTechnology)} w='full'>
                                Edit
                            </Button>
                        </VStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>);
};

export default TechnologyCard