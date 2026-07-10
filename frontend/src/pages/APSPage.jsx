import React, { useRef, useEffect, useState } from 'react'
import { Box, Center, Container, Spacer, Divider, HStack, Stack, Flex, Link, Text, VStack, Select, Button, Image } from '@chakra-ui/react';
import { getAccessToken } from "../services/apsToken";
//import CustomGeometryExtension from '../extensions/customGeometryExtension';
import SceneBuilderExtension from '../extensions/SceneBuilderExtension';
import { initViewer, loadModel, zoomToDoors, zoomToRoofs, zoomToWalls } from './APSScripts';

const AVAILABLE_MODELS = [
    { name: "House - Architectural", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9Qcm95ZWN0b0Nhc2FfMjAyNV9hLnJ2dA" },
    { name: "Hydrical tunnel on airport ", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9DQ1NfRVNUXzAxLnJ2dA" },
    { name: "Judicial building - Structural", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9DQVBKX0NlbnRybyUyMGRlJTIwSnVzdGljaWElMjBWYWxkaXZpYShFc3QpLnJ2dA" }
];

const chileanLandscape = "/vista-lago-pehoe-y-macizo-1.png";

export const APSPage = () => {

    const viewerContainer = useRef(null);
    const viewerInstance = useRef(null);

    const [selectedUrn, setSelectedUrn] = useState(AVAILABLE_MODELS[0].urn);

    useEffect(() => {
        let viewer;

        // Initialize the viewer
        initViewer(viewerContainer.current).then((v) => {
            viewer = v;
            viewerInstance.current = v;


            // Assuming you have a loadModel function
            if (selectedUrn) {
                loadModel(viewer, selectedUrn);

            }
        }).catch(err => console.error("Viewer Init Error:", err));

        // CLEANUP: This is critical to prevent the "t.Replace" error on re-renders
        return () => {
            if (viewer) {
                viewer.finish();
                viewer = null;
                viewerInstance.current = null;
            }
        };
    }, []); // Re-run if the URN changes

    useEffect(() => {
        const viewer = viewerInstance.current;

        if (viewer && selectedUrn) {
            loadModel(viewer, selectedUrn);
        }
    })

    return (
        <>
            <Container maxW="container.xl" py={5}>
                {/* The outer box handles layout positioning */}
                <Box
                    position="relative"  // CRITICAL: This serves as the anchor point for the absolute child
                    width="100%"
                    height="80vh"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="lg"
                >
                    {/* FLOATING OVERLAY PANEL (Positioned on the top-left) */}
                    <Box
                        position="absolute"
                        top="20px"
                        left="20px"
                        zIndex="10"       // Ensures it floats on top of the WebGL 3D Canvas
                        bg="white"        // Solid background so the viewer geometry doesn't bleed through
                        p={4}
                        borderRadius="md"
                        boxShadow="xl"
                        width="260px"
                        border="1px solid"
                        borderColor="gray.200"
                    >
                        <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.700">
                            Select Asset View:
                        </Text>
                        <Select
                            value={selectedUrn}
                            onChange={(e) => setSelectedUrn(e.target.value)}
                            size="sm"
                            borderRadius="md"
                            focusBorderColor="teal.500"
                        >
                            {AVAILABLE_MODELS.map((model) => (
                                <option key={model.urn} value={model.urn}>
                                    {model.name}
                                </option>
                            ))}
                        </Select>

                        <VStack spacing={2} align={'stretch'} mt={4}>
                            <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.700">
                                Elements selection:</Text>
                            <Button w={"100%"}
                                onClick={() => zoomToDoors(viewerInstance.current)}>
                                Select all the doors
                            </Button>

                            <Button w={"100%"}
                                onClick={() => zoomToWalls(viewerInstance.current)}>
                                Select all the walls
                            </Button>

                            <Button w={"100%"}
                                onClick={() => zoomToRoofs(viewerInstance.current)}>
                                Select all the roofs
                            </Button>

                        </VStack>

                        <VStack spacing={2} align={'stretch'} mt={4}>
                            <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.700">
                                Elements Creation:</Text>
                            <Button w={"100%"}
                                onClick={async () => {

                                    const sceneExt = await viewerInstance.current.loadExtension("SceneBuilderExtension");

                                    console.log(sceneExt);

                                    if (sceneExt) {
                                        sceneExt.createBuildingClearance();
                                    }
                                }}>
                                Create building clearance
                            </Button>

                            <Button w={"100%"}
                                onClick={async () => {

                                    const sceneExt = await viewerInstance.current.loadExtension("SceneBuilderExtension");

                                    console.log(sceneExt);

                                    if (sceneExt) {
                                        sceneExt.markAccessPoints();
                                    }
                                }}>
                                Mark access points
                            </Button>
                        </VStack>
                    </Box>

                    {/* FLOATING OVERLAY PANEL (Positioned on the top-right) */}
                    <Box
                        position="absolute"
                        top="20px"
                        right="20px"
                        zIndex="10"
                        bg="white"
                        p={4}
                        borderRadius="md"
                        boxShadow="xl"
                        width="230px"
                        border="1px solid"
                        borderColor="gray.200"
                        m={2}
                        cursor={'pointer'}
                        visibility={selectedUrn === AVAILABLE_MODELS[0].urn ? 'visible' : 'hidden'}
                        maxH="550px"
                        overflowY="auto"
                    >
                        <Box position="relative" cursor="pointer">
                            <Image src={"/PlacesOnHouse/BookShelf.PNG"}
                                alt="BookShelf"
                                width="100%" mt={2} onClick={async () => {

                                    const sceneExt = await viewerInstance.current.loadExtension("SceneBuilderExtension");

                                    console.log(sceneExt);

                                    if (sceneExt) {
                                        sceneExt.goToBookShelf();
                                    }
                                }} />
                            <Text position="absolute"
                                bottom="5px"
                                left="5px"
                                color="white"
                                fontWeight="bold"
                                fontSize="sm"
                                bg="rgba(0, 0, 0, 0.6)"
                                px={2}
                                py={1}
                                borderRadius="md">
                                BookShelf</Text>
                        </Box>
                        <Box position="relative" cursor="pointer">
                            <Image src="/PlacesOnHouse/Kitchen.PNG"
                                alt="Kitchen"
                                width="100%" mt={2} onClick={async () => {

                                    const sceneExt = await viewerInstance.current.loadExtension("SceneBuilderExtension");

                                    console.log(sceneExt);

                                    if (sceneExt) {
                                        sceneExt.goToKitchen();
                                    }
                                }} />
                            <Text position="absolute"
                                bottom="5px"
                                left="5px"
                                color="white"
                                fontWeight="bold"
                                fontSize="sm"
                                bg="rgba(0, 0, 0, 0.6)"
                                px={2}
                                py={1}
                                borderRadius="md">
                                Kitchen
                            </Text>
                        </Box>
                        <Box position="relative" cursor="pointer">
                            <Image src="/PlacesOnHouse/MasterBedroom.PNG"
                                alt="MasterBedroom"
                                width="100%" mt={2} onClick={async () => {

                                    const sceneExt = await viewerInstance.current.loadExtension("SceneBuilderExtension");

                                    console.log(sceneExt);

                                    if (sceneExt) {
                                        sceneExt.goToMasterBedroom();
                                    }
                                }} />
                            <Text position="absolute"
                                bottom="5px"
                                left="5px"
                                color="white"
                                fontWeight="bold"
                                fontSize="sm"
                                bg="rgba(0, 0, 0, 0.6)"
                                px={2}
                                py={1}
                                borderRadius="md">
                                Master Bedroom
                            </Text>
                        </Box>
                        <Box position="relative" cursor="pointer">
                            <Image src="/PlacesOnHouse/KidsBedroom.PNG"
                                alt="KidsBedroom"
                                width="100%" mt={2} onClick={async () => {

                                    const sceneExt = await viewerInstance.current.loadExtension("SceneBuilderExtension");

                                    console.log(sceneExt);

                                    if (sceneExt) {
                                        sceneExt.goToKidsBedroom();
                                    }
                                }} />
                            <Text position="absolute"
                                bottom="5px"
                                left="5px"
                                color="white"
                                fontWeight="bold"
                                fontSize="sm"
                                bg="rgba(0, 0, 0, 0.6)"
                                px={2}
                                py={1}
                                borderRadius="md">
                                Kids Bedroom
                            </Text>
                        </Box>
                    </Box>

                    {/* THE 3D VIEWING CANVAS */}
                    <div
                        ref={viewerContainer}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    />
                </Box>
            </Container >
        </>
    );
};

