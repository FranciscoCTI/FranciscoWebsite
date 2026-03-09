import { useEffect, useRef } from "react";
import { getAccessToken } from "../services/apsToken";

export default function APSViewer({ urn }) {

    const viewerDiv = useRef(null);
    const viewerRef = useRef(null);

    useEffect(() => {

        const options = {
            env: "AutodeskProduction2",
            api: "streamingV2",
            getAccessToken
        };

        window.Autodesk.Viewing.Initializer(options, () => {

            const viewer = new window.Autodesk.Viewing.GuiViewer3D(viewerDiv.current);
            viewer.start();

            viewerRef.current = viewer;

            if (urn) loadModel(viewer, urn);

        });

        return () => {
            if (viewerRef.current) {
                viewerRef.current.finish();
                viewerRef.current = null;
            }
        };

    }, [urn]);

    return (
        <div
            ref={viewerDiv}
            style={{ width: "100%", height: "100vh" }}
        />
    );
}

function loadModel(viewer, urn) {

    const documentId = "urn:" + urn;

    window.Autodesk.Viewing.Document.load(
        documentId,
        (doc) => {

            const viewable = doc.getRoot().getDefaultGeometry();

            viewer.loadDocumentNode(doc, viewable);

        },
        (err) => console.error(err)
    );

}