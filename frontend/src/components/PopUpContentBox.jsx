import React, { useEffect, useState, useRef } from 'react';
import {
    VStack, HStack, Box, Button, useColorModeValue, useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, Input, ModalFooter, ChakraProvider, Text,
    Center
} from '@chakra-ui/react'


const PopUpContentBox = ({ project }) => {

    const textColor = useColorModeValue("black", "white"); // light / dark text
    const backGroundColor = useColorModeValue("white", "#1A202C"); // light / dark text

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [updatedProject, setUpdatedProject] = useState(project);

    const projectName = project?.title;
    const imageUrl = "/" + projectName + ".png";

    const allImages = import.meta.glob("../assets/*/*.{png,PNG,jpg,JPG,jpeg,svg}", {
        eager: true,
    });

    const images = Object.entries(allImages)
        .filter(([path]) => path.includes(`/${projectName}/`))
        .map(([_, module]) => module.default);

    console.log("Loaded images:", images);

    function Gallery() {

        if (images.length === 0) {
            return <p>No images found for project: {projectName}</p>;
        }

        return Object.values(images).map((img, i) => (
            <img key={i} src={img} alt={`img-${i}`}
                style={{
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    marginBottom: "5px", marginTop: "5px"
                }} />
        ));
    };

    console.log(images);

    //console.log("/" + projectName + ".png");

    const handleModalClose = () => {
        setUpdatedProject(project);
        onClose();
    };

    const handleModalOpen = () => {
        setUpdatedProject(project);
        onOpen();
    };

    return (
        <>
            <ChakraProvider>
                <Box bg={backGroundColor} color={textColor} fontWeight={'bold'} fontSize={17}
                    fontFamily={'monospace'} borderRadius={0}>
                    <VStack>
                        <Box
                            maxW="200px"
                            whiteSpace="normal"
                            overflowWrap="break-word"
                        >
                            {project.title}
                        </Box>
                        <HStack>
                            <Box background={'lightBlue'} padding={2} fontSize={10} >
                                <p>{project.type}</p>
                            </Box>
                            <Box background={'yellow'} padding={2} fontSize={10}>
                                <p>{project.year}</p>
                            </Box>
                        </HStack>
                        <img src={imageUrl} style={{ width: "200px", height: "150px", objectFit: "contain" }}></img>
                        <Button padding={2}
                            size="m"
                            fontSize={13}
                            borderRadius={0}
                            mt={0}
                            background="blue"
                            color="white"
                            _hover={{ background: "grey" }}
                            onClick={handleModalOpen}
                        >
                            See more
                        </Button>
                    </VStack>
                </Box>

                <Modal isOpen={isOpen} onClose={handleModalClose} isCentered={true}>
                    <ModalOverlay bg={"blackAlpha.600"} />
                    <ModalContent maxW={{ base: "90%", md: "600px" }}
                        borderRadius="none"
                        boxShadow="xl"
                        p={{ base: 2, md: 4 }}>
                        <ModalHeader textAlign={'center'}>{updatedProject.title}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box>
                                <VStack spacing={3} align={'flex-start'}>
                                    <HStack w={'100%'}>
                                        <Text flex={1} fontWeight={'bold'}>Year: </Text>
                                        <Text flex={5}>{updatedProject.year}</Text>
                                    </HStack>
                                    <HStack align={'start'} w={'100 %'}>
                                        <Text flex={1} fontWeight={'bold'}>Description: </Text>
                                        <Text flex={5}>{updatedProject.description}</Text>
                                    </HStack>
                                    <HStack align={'start'}>
                                        <Text flex={1} fontWeight={'bold'}>My role: </Text>
                                        <Text flex={5}>{updatedProject.myRoleOnIt}</Text>
                                    </HStack>
                                </VStack>
                            </Box>
                            <Gallery></Gallery>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </ChakraProvider>
        </>
    );
};

export default PopUpContentBox;
