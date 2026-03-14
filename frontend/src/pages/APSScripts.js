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

                const options1 = {
                    env: 'AutodeskProduction1',
                    api: 'streamingV2',
                    documentId: 'tests/unittest/models/glTF/duck.gltf',
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
                extensions: ['Autodesk.DocumentBrowser', 'MiPrimeraExtension', 'ToolBarExtension']
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

export function loadModel(viewer, urn) {

    console.log("URN value:", urn);
    console.log("URN type:", typeof urn);

    const cleanUrn = urn.replace(/^urn:/, "");

    const documentId = "urn:" + cleanUrn;

    window.Autodesk.Viewing.Document.load(
        documentId,
        //this is the success callback, where we get the document object that contains all the info about the model and its viewables
        (doc) => {

            const viewable = doc.getRoot().getDefaultGeometry();

            viewer.loadDocumentNode(doc, viewable);

            zoomToWalls(viewer);
        },
        //this is the error callback, where we can handle any issues that arise during the loading process
        (err) => console.error(err)
    );

}

export const zoomToWalls = (viewer) => {
    viewer.search("Wall", (dbIds) => {
        if (dbIds.length > 0) {
            viewer.select(dbIds);
            viewer.isolate(dbIds);
            viewer.fitToView(dbIds);

            console.log(`Found and zoomed to ${dbIds.length} walls.`);
        } else {
            console.warn("No walls found in this model.");

            // EMERGENCY DEBUG: Let's see what categories actually exist in your model
            const tree = viewer.model.getData().instanceTree;
            console.log("Instance Tree object:", tree);
            alert("Check your console (F12) to see the real property names!");
        }
    }, (err) => {
        console.error("Search failed:", err);
    });
}

export const zoomToDoors = (viewer) => {
    viewer.search("Door", (dbIds) => {
        if (dbIds.length > 0) {

            viewer.select(dbIds);
            viewer.isolate(dbIds);
            viewer.fitToView(dbIds);

            console.log(`Found and zoomed to ${dbIds.length} doors.`);
        } else {
            console.warn("No doors found in this model.");

            // EMERGENCY DEBUG: Let's see what categories actually exist in your model
            const tree = viewer.model.getData().instanceTree;
            console.log("Instance Tree object:", tree);
            alert("Check your console (F12) to see the real property names!");
        }
    }, (err) => {
        console.error("Search failed:", err);
    });
}
