import React, { useRef, useEffect, useState } from 'react'
import { Box, Center, Button, Container, Spacer, Divider, HStack, Stack, Flex, Link, Text, VStack } from '@chakra-ui/react';
import { initViewer, loadModel, zoomToWalls, zoomToDoors } from './APSScripts';
import { set } from 'mongoose';

export const APSPage = ({ urn }) => {

    const [isReady, setIsReady] = useState(false);
    const viewerContainer = useRef(null);
    const viewerInstance = useRef(null);

    useEffect(() => {
        let viewer;

        // Initialize the viewer
        initViewer(viewerContainer.current).then((v) => {
            viewer = v;
            viewerInstance.current = v;

            // Assuming you have a loadModel function
            if (urn) {
                loadModel(viewer, urn);

                viewer.addEventListener(window.Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function () {
                    setIsReady(true);
                });
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
    }, [urn]); // Re-run if the URN changes

    return (
        <>
            <div
                ref={viewerContainer}
                style={{ position: 'relative', width: '100%', height: '80vh' }}
            >
                <Box position="absolute">
                    <VStack position="absolute"
                        top="10px"
                        left="10px"
                        spacing={2}
                        align="start"
                        padding={4}
                        backgroundColor="rgba(255, 255, 255, 0.8)"
                        borderRadius="md"
                        boxShadow="md">
                        <Button
                            id="zoomToWallsBtn"
                            zIndex="10"
                            colorScheme="blue"
                            isDisabled={!isReady}
                            onClick={() => zoomToWalls(viewerInstance.current)}
                        >
                            {isReady ? "Zoom to All Walls" : "Loading Model Data..."}
                        </Button>

                        <Button
                            id="zoomToDoorsBtn"
                            zIndex="10"
                            colorScheme="blue"
                            isDisabled={!isReady}
                            onClick={() => zoomToDoors(viewerInstance.current)}
                        >
                            {isReady ? "Zoom to All Doors" : "Loading Model Data..."}
                        </Button>
                    </VStack>
                </Box>
            </div>
        </>
    );
};

