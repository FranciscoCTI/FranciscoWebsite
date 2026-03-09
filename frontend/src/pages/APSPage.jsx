import React, { useRef, useEffect } from 'react'
import { Box, Center, Container, Spacer, Divider, HStack, Stack, Flex, Link, Text, VStack } from '@chakra-ui/react';
import { getAccessToken } from "../services/apsToken";

export const APSPage = ({ urn }) => {

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
            />
        </>
    );
};

export const initViewer = (container) => {

    let initializerPromise = null;
    return new Promise((resolve, reject) => {
        // 1. Critical Check: Is the Autodesk library loaded from the <script> tag?
        if (typeof Autodesk === 'undefined') {
            return reject(new Error("Autodesk Viewer library not found. Check your index.html scripts."));
        }

        // 2. Singleton Initializer: APS should only be initialized ONCE per session
        if (!initializerPromise) {
            initializerPromise = new Promise((res) => {
                const options = {
                    env: 'AutodeskProduction',
                    getAccessToken: (onTokenReady) => {
                        // Replace with your actual MERN backend endpoint
                        fetch('/api/token')
                            .then(response => response.json())
                            .then(data => onTokenReady(data.access_token, data.expires_in));
                    }
                };
                window.Autodesk.Viewing.Initializer(options, res);
            });
        }

        // 3. Mount the Viewer
        initializerPromise.then(() => {
            const config = {
                extensions: ['Autodesk.DocumentBrowser']
            };

            // Ensure we are passing the raw DOM element from the React Ref
            const viewer = new window.Autodesk.Viewing.GuiViewer3D(container, config);

            const startedCode = viewer.start();
            if (startedCode > 0) {
                return reject(new Error(`Viewer failed to start with code: ${startedCode}`));
            }

            viewer.setTheme('light-theme');
            resolve(viewer);
        });
    });
}

function loadModel(viewer, urn) {

    console.log("URN value:", urn);
    console.log("URN type:", typeof urn);

    const cleanUrn = urn.replace(/^urn:/, "");

    const documentId = "urn:" + cleanUrn;

    window.Autodesk.Viewing.Document.load(
        documentId,
        (doc) => {

            const viewable = doc.getRoot().getDefaultGeometry();

            viewer.loadDocumentNode(doc, viewable);

        },
        (err) => console.error(err)
    );

}
