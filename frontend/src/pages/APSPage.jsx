import React, { useRef, useEffect, useState } from 'react'
import { Box, Center, Container, Spacer, Divider, HStack, Stack, Flex, Link, Text, VStack, Select } from '@chakra-ui/react';
import { getAccessToken } from "../services/apsToken";
import CustomGeometryExtension from '../extensions/customGeometryExtension';
import { initViewer } from './APSScripts';

const AVAILABLE_MODELS = [
    { name: "Architectural House", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9Qcm95ZWN0b0Nhc2FfMjAyNV9hLnJ2dA" },
    { name: "Hydrical airport tunnel", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9DQ1NfRVNUXzAxLnJ2dA" },
    { name: "Structural juditial building", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9DQVBKX0NlbnRybyUyMGRlJTIwSnVzdGljaWElMjBWYWxkaXZpYShFc3QpLnJ2dA" }
];

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
                    </Box>

                    {/* THE 3D VIEWING CANVAS */}
                    <div
                        ref={viewerContainer}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    />
                </Box>
            </Container>
        </>
    );
};

