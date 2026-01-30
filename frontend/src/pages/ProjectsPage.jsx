import React, { useEffect, useState, useRef } from 'react'
import { useProjectStore } from '../store/project';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
//import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Universities } from '../components/Universities';
import MyMap from '../components/Map.jsx';
import MyMapB from '../components/MapB.jsx';
import GoogleMapSection from '../components/GoogleMapSection.jsx';
import { CreationBar } from '../components/CreationBar.jsx';
import {
    VStack, Container, Text, SimpleGrid, useColorModeValue, Button, Modal, useDisclosure, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton, Box,
    ModalBody, Input, ModalFooter,
    HStack, Select
} from '@chakra-ui/react'
import { PROJECT_TYPES } from "../../../backend/models/Enums/ProjectTypes.js";
import { useEmployerStore } from '../store/employer';

const ProjectsPage = () => {

    const { projects, fetchProjects, createProject } = useProjectStore();
    const { employers, fetchEmployers } = useEmployerStore();

    useEffect(() => {
        fetchEmployers();
    }, []);

    useEffect(() => {
        fetchProjects();
    }, []);

    const years = [];
    for (let y = 1950; y <= new Date().getFullYear(); y++) {
        years.push(y);
    }

    console.log("📌 Projects in store post to fetch:", projects);

    console.log('Google Maps API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
    console.log('Google Maps ID:', import.meta.env.VITE_GOOGLE_PROJECTS_MAP_ID);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [newProject, setNewProject] = useState({
        title: "",
        type: "",
        description: "",
        myRoleOnIt: "",
        companyId: "",
        year: 2026,
    });

    useEffect(() => {
        if (employers.length && !newProject.companyId) {
            setNewProject((prev) => ({
                ...prev,
                companyId: employers[0]._id,
            }));
        }
    }, [employers]);

    const handleModalClose = () => {
        onClose();
    };

    const handleAddProject = async () => {

        const formData = new FormData();
        formData.append("title", newProject.title);
        formData.append("type", newProject.type);
        formData.append("description", newProject.description);
        formData.append("companyId", newProject.companyId);
        formData.append("myRoleOnIt", newProject.myRoleOnIt);
        formData.append("year", newProject.year);

        setNewProject(newProject);

        const { success, message } = await createProject(formData);

        console.log("Success:", success);
        console.log("Message", message);

        setNewProject({
            title: 'New project',
            type: '',
            companyId: '',
            myRoleOnIt: ''
        })

        onClose();
    };

    return (
        <div>
            <GoogleMapSection projects={projects}></GoogleMapSection>
            <CreationBar onClickCreate={onOpen}></CreationBar>
            {/*<MyMap content={projects}></MyMap>*/}

            <Modal isOpen={isOpen} onClose={handleModalClose} isCentered={true} fontFamily={'monospace'}>
                <ModalOverlay bg={"blackAlpha.600"} />
                <ModalContent maxW={{ base: "90%", md: "600px" }}
                    borderRadius="none"
                    boxShadow="xl"
                    p={{ base: 2, md: 4 }}>
                    <ModalHeader textAlign={'center'} fontFamily={'monospace'} fontSize={27}>Creating new project</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box fontFamily={'monospace'} fontSize={13} p={3}>
                            <VStack spacing={3}>
                                <Input placeholder='Project title'
                                    name='name'
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                />

                                <Select value={newProject.type || ""} onChange={(e) => setNewProject({ ...newProject, type: e.target.value })} maxHeight={"150px"} overflowY={"auto"}>
                                    <option value="">Select project type</option>
                                    {PROJECT_TYPES.map(y => (
                                        <option key={y.value} value={y.label}>{y.label}</option>
                                    ))}
                                </Select>

                                <Select value={newProject.companyId || ""} onChange={(e) => setNewProject({ ...newProject, companyId: e.target.value })} maxHeight={"150px"} overflowY={"auto"}>
                                    <option value=""></option>
                                    {employers.map(y => (
                                        <option key={y._id} value={y._id}>{y.name}</option>
                                    ))}
                                </Select>

                                <Select value={newProject.year || ""}
                                    onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
                                    maxHeight={"150px"}
                                    overflowY={"auto"}>
                                    {years.map(y => (
                                        <option key={y.toString()} value={y}>{y}</option>
                                    ))}
                                </Select>

                                <Input placeholder='Project description'
                                    name='description'
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                />

                                <Input placeholder='My role on the project...'
                                    name='myRole'
                                    value={newProject.myRoleOnIt}
                                    onChange={(e) => setNewProject({ ...newProject, myRoleOnIt: e.target.value })}
                                />

                                <Button colorScheme='blue' onClick={handleAddProject} w='full'>
                                    Add
                                </Button>
                            </VStack>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ProjectsPage