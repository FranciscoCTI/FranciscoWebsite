import React from 'react'
import {
    Box, Container, Heading, HStack, VStack,
    IconButton, Text, useColorModeValue, Image,
    useToast, Modal, useDisclosure, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, Input, ModalFooter, Button, Select, Wrap,
    Stack, Link, Spacer, Collapse
} from '@chakra-ui/react';

const TechnologyCard = ({ technology }) => {

    var techName = technology.name;
    techName = techName.replace("#", "");

    const { isOpen, onToggle } = useDisclosure();

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
                        <Text fontSize={20} >{"User level: " + technology.userLevel}</Text>
                    </HStack>
                    <HStack align="start" w='full'>
                        <Link fontSize={20} href={technology.website} isExternal color="blue.500">
                            {technology.website}
                        </Link>
                    </HStack>
                </VStack>
                <Spacer></Spacer>
                <img src={"/" + techName + ".png"} style={{ width: "150px", height: "150px", objectFit: "contain" }}></img>
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
    </>);
};

export default TechnologyCard