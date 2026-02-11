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
    Button,
    Input, Select
} from '@chakra-ui/react'
import { CloseButton } from '@chakra-ui/react';
import { useProjectStore } from '../store/project';
import { useEmployerStore } from '../store/employer';
import { PROJECT_TYPES } from "../../../backend/models/Enums/ProjectTypes.js";
import { Link } from "react-router-dom";

function MarkerInfo({ item, closeHandler }) {

    const backGroundColor = useColorModeValue('white', "gray.800");
    const intermediateColor = useColorModeValue('blue.100', "gray.500");
    const textColor = useColorModeValue("black", "yellow");
    const placeholderColor = useColorModeValue("gray.500", "yellow.600");

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();

    const [project, setProject] = useState(item);

    const { projects, fetchProjects, removeProject, updateProject } = useProjectStore();

    const { employers, fetchEmployers } = useEmployerStore();

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const getCompanyNameById = (id) =>
        employers.find(e => e._id === id)?.name ?? "Unknown company";

    const years = [];
    for (let y = 1950; y <= new Date().getFullYear(); y++) {
        years.push(y);
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleModalClose = () => {
        onClose();
    };

    const handleModalEditClose = () => {
        onCloseEdit();
    };

    const handleMoreInfoClick = () => {
        setProject(item);
        onOpen();
    };

    const handleEditClick = () => {
        setProject(item);
        setSelectedFile(project.image);
        onOpenEdit();
    };

    const handleRemoveProject = () => {
        removeProject(project._id);
    };

    const handleEditProject = async (id, updatedProj) => {

        try {
            const formData = new FormData();

            for (const [key, value] of Object.entries(updatedProj)) {
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

            await updateProject(id, formData);

            console.log(`Updated project: ${project.title}`);
            fetchProjects();
            onCloseEdit();
        } catch (err) {
            console.error("Error updating project", err);
        }
    };


    return (
        <div>
            <Box bg={backGroundColor}
                position='absolute'
                transform="translate(-50%)" padding={2}
                fontWeight={'bold'}
                fontFamily={'monospace'}
                fontSize={20}>
                <VStack align={'end'}>
                    <HStack spacing={2} align={'left'}>
                        <Box fontSize="20px"
                            whiteSpace="nowrap"
                            padding={1} color={textColor}
                        >
                            {project.title}
                        </Box>
                        <CloseButton size={'sm'}
                            _hover={{ bg: "gray.100" }}
                            onClick={() => closeHandler()} />
                    </HStack>
                    <Flex justify="flex-end" w="100%" p={1}
                    >
                        <Button m={0.5}
                            textColor={'white'}
                            bg="blue"
                            size="xs"
                            onClick={
                                handleMoreInfoClick
                            }
                        >More info</Button>
                        <Button bg={'yellow'} textColor={'Black'} m={0.5} size="xs" onClick={handleEditClick}>Edit</Button>
                        <Button bg={'red'} textColor={'Black'} m={0.5} disabled size="xs" onClick={handleRemoveProject}>Remove</Button>
                    </Flex>
                </VStack>
            </Box>

            //This is to show project information
            <Modal isOpen={isOpen}
                onClose={handleModalClose}
                isCentered={true}
                fontFamily={'monospace'}
            >
                <ModalOverlay bg={"blackAlpha.600"} />
                <ModalContent maxW={{ base: "90%", md: "600px" }}
                    borderRadius="none"
                    boxShadow="xl"
                    p={{ base: 2, md: 4 }} bg={backGroundColor}>
                    <ModalHeader textColor={textColor}
                        textAlign={'center'}
                        fontFamily={'monospace'}
                        fontSize={27}>{project.title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box fontFamily={'monospace'} fontSize={13} p={1} bg={backGroundColor}>
                            <VStack spacing={3} align={'start'}>
                                <Box p={3} bg={backGroundColor} w={'full'} fontSize={15}>
                                    <HStack p={'2'} align={'center'}>
                                        <Text color={textColor} fontSize={25}>
                                            Year:
                                        </Text>
                                        <Text color={textColor} >
                                            {project.year}
                                        </Text>
                                    </HStack>
                                    <HStack p={2} align={'center'}>
                                        <Text f color={textColor} m={0} fontSize={25}>
                                            Type:
                                        </Text>
                                        <Text color={textColor}>
                                            {project.type}
                                        </Text>
                                    </HStack>
                                    <HStack p={2} align={'start'}>
                                        <Text f color={textColor} m={0} fontSize={25}>
                                            Description:
                                        </Text>
                                        <Text color={textColor}>
                                            {project.description}
                                        </Text>
                                    </HStack>
                                    <HStack p={2} align={'start'}>
                                        <Text color={textColor} m={0} fontSize={25}>
                                            My role on this project:
                                        </Text>
                                        <Text color={textColor}>
                                            {project.myRoleOnIt}
                                        </Text>
                                    </HStack>
                                    <HStack p={2} align={'center'}>
                                        <Text color={textColor} m={0} fontSize={25}>
                                            Company:
                                        </Text>
                                        <Link color='blue' to={`/employers?selected=${project.companyId}`} >
                                            <Text color={'magenta'}>
                                                {getCompanyNameById(project.companyId)}
                                            </Text>
                                        </Link>
                                    </HStack>
                                    <img src={`http://localhost:5000/uploads/${project.image}`} style={{ padding: 7, width: "100%", height: "auto", objectFit: "contain" }}></img>
                                </Box>
                            </VStack>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>

            //This is to edit project information
            <Modal isOpen={isOpenEdit}
                onClose={handleModalEditClose}
                isCentered={true}
                fontFamily={'monospace'}
            >
                <ModalOverlay bg={"blackAlpha.600"} />
                <ModalContent maxW={{ base: "90%", md: "600px" }}
                    borderRadius="none"
                    boxShadow="xl"
                    p={{ base: 2, md: 4 }}
                >
                    <ModalHeader textAlign={'center'}
                        fontFamily={'monospace'}
                        fontSize={27}>{project.title}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box fontFamily={'monospace'} fontSize={13} p={1}>
                            <VStack spacing={3} align={'start'}>
                                <Box p={3} w={'full'} fontSize={15}>
                                    <HStack p={'2'} align={'center'}>
                                        <Text fontSize={25}>
                                            Year:
                                        </Text>
                                        <Select value={project.year || ""}
                                            onChange={(e) => setProject({ ...project, year: e.target.value })}
                                            maxHeight={"150px"}
                                            overflowY={"auto"}>
                                            {years.map(y => (
                                                <option key={y.toString()} value={y}>{y}</option>
                                            ))}
                                        </Select>
                                    </HStack>
                                    <HStack p={2} align={'center'}>
                                        <Text m={0} fontSize={25}>
                                            Type:
                                        </Text>
                                        <Select value={project.type || ""} onChange={(e) => setProject({ ...project, type: e.target.value })}
                                            maxHeight={"150px"}
                                            overflowY={"auto"}>
                                            <option value="">Select project type</option>
                                            {PROJECT_TYPES.map(y => (
                                                <option key={y.value} value={y.label}>{y.label}</option>
                                            ))}
                                        </Select>
                                    </HStack>
                                    <HStack p={2} align={'start'}>
                                        <Text m={0} fontSize={25}>
                                            Description:
                                        </Text>
                                        <Input placeholder='Project description'
                                            name='description'
                                            value={project.description}
                                            onChange={(e) => setProject({ ...project, description: e.target.value })}
                                        />
                                    </HStack>
                                    <HStack p={2} align={'start'}>
                                        <Text m={0} fontSize={25}>
                                            My role on this project:
                                        </Text>
                                        <Input placeholder='My role on the project...'
                                            name='myRole'
                                            value={project.myRoleOnIt}
                                            onChange={(e) => setProject({ ...project, myRoleOnIt: e.target.value })}
                                        />
                                    </HStack>
                                    <HStack p={2} align={'center'}>
                                        <Text m={0} fontSize={25}>
                                            Company:
                                        </Text>
                                        <Select value={project.companyId || ""} onChange={(e) => setProject({ ...project, companyId: e.target.value })} maxHeight={"150px"} overflowY={"auto"}>
                                            <option value=""></option>
                                            {employers.map(y => (
                                                <option key={y._id} value={y._id}>{y.name}</option>
                                            ))}
                                        </Select>
                                    </HStack>
                                    <Box align={'center'}>
                                        <VStack>
                                            <img src={previewUrl ? previewUrl : `http://localhost:5000/uploads/${project.image}`}
                                                style={{ padding: 7, width: "50%", height: "auto", objectFit: "contain" }}></img>
                                            <input type="file"
                                                accept='image/*'
                                                onChange={(e) => {
                                                    const file = e.target.files[0];

                                                    if (!file) return;

                                                    setSelectedFile(file);
                                                    setPreviewUrl(URL.createObjectURL(file));
                                                }}
                                            >
                                            </input>
                                        </VStack>
                                    </Box>
                                    <Button align={'center'} margin={3}
                                        colorScheme='yellow'
                                        width={"50%"}
                                        onClick={() => handleEditProject(project._id, project)} w='full'>Edit</Button>
                                </Box>
                            </VStack>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal >
        </div >
    )
}


export default MarkerInfo;
