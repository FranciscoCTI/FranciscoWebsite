import React, { useRef, useEffect, useState } from 'react'
import { Box, Center, Button, Container, Spacer, Divider, HStack, Stack, Flex, Link, Text, VStack } from '@chakra-ui/react';
import { initViewer, loadModel, zoomToWalls, zoomToDoors } from './APSScripts';
import { set } from 'mongoose';
import '../css/APSPage.css';
import miPrimeraExtension from '../extensions/miPrimeraExtension';
import ToolBarExtension from '../extensions/toolBarExtension';

export const APSPage = ({ urn }) => {

    const [isReady, setIsReady] = useState(false);
    const viewerContainer = useRef(null);
    const viewerInstance = useRef(null);
    const [selectionCount, setSelectionCount] = useState(0);

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

                const onSelectionEvent = (event) => {
                    const currSelection = viewer.getSelection();
                    setSelectionCount(currSelection.length);
                    console.log("Current selection count:", currSelection.length);
                };

                //register the listener for selection changes
                viewer.addEventListener(window.Autodesk.Viewing.SELECTION_CHANGED_EVENT, onSelectionEvent);

                viewer._onSelectionEvent = onSelectionEvent; // Store the reference for cleanup

                //Navigation event listener
                const onNavigationEvent = () => {
                    var domElem = document.getElementById('MyToolValue');
                    domElem.innerText = viewer.getActiveNavigationTool();
                };

                viewer.addEventListener(window.Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, onNavigationEvent);
                viewer._onNavigationModeEvent = onNavigationEvent;

            }
        }).catch(err => console.error("Viewer Init Error:", err));

        // CLEANUP: This is critical to prevent the "t.Replace" error on re-renders
        return () => {
            if (viewer) {
                viewer.finish();
                viewer = null;
                viewerInstance.current = null;
            }

            if (viewer._onSelectionEvent) {
                viewer.removeEventListener(window.Autodesk.Viewing.SELECTION_CHANGED_EVENT, viewer._onSelectionEvent);
                viewer.removeEventListener(window.Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, viewer._onNavigationModeEvent);
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
                        align="stretch"
                        padding={4}
                        backgroundColor="rgba(255, 255, 255, 0.8)"
                        borderRadius="md"
                        boxShadow="md"
                        width="350px">
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
                        <Button
                            id="improvementABtn"
                            zIndex="10"
                            colorScheme="yellow"
                            isDisabled={!isReady}

                        >
                            {isReady ? "Home Improvement A" : "Loading Model Data..."}
                        </Button>
                        <div className="my-custom-ui">
                            <div>Items selected: <span id="MySelectionValue">{selectionCount}</span></div>
                            <div>
                                Navigation tool: <span id="MyToolValue">N/A</span>
                            </div>
                        </div>
                        <div className='my-custom-ui'>
                            <Text fontSize="m" color="gray.600">Custom Extension Controls:</Text>
                            <Button colorScheme="green" id="miPrimerBotonDeBloqueo">Lock it</Button>
                            <Button colorScheme="red" id="miPrimerBotonDeDesbloqueo">Unlock it</Button>
                        </div>
                    </VStack>
                </Box>
            </div>
        </>
    );
};

