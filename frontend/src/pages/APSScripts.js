import { Autocomplete } from "@react-google-maps/api";

export const initViewer = (container) => {

    let initializerPromise = null;
    return new Promise((resolve, reject) => {
        if (typeof Autodesk === 'undefined') {
            return reject(new Error("Autodesk Viewer library not found. Check your index.html scripts."));
        }

        if (!initializerPromise) {
            initializerPromise = new Promise((res) => {

                const options = {
                    env: 'AutodeskProduction',
                    getAccessToken: (onTokenReady) => {
                        fetch('/api/token')
                            .then(response => response.json())
                            .then(data => onTokenReady(data.access_token, data.expires_in));
                    }
                };

                window.Autodesk.Viewing.Initializer(options, res);
            });
        }

        initializerPromise.then(() => {
            const config = {
                extensions: [
                    'Autodesk.DocumentBrowser', /*'CustomGeometryExtension', */'SceneBuilderExtension'
                ]
            };

            const viewer = new window.Autodesk.Viewing.GuiViewer3D(container, config);

            viewer.loadExtension("SceneBuilderExtension")
                /*.then(() => viewer.loadExtension("CustomGeometryExtension"))*/
                .then(() => {
                    viewer.setTheme("light-theme");
                    resolve(viewer);
                })
                .catch(reject);

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

    viewer.currentUrn = urn;

    const documentId = "urn:" + cleanUrn;

    window.Autodesk.Viewing.Document.load(
        documentId,
        //this is the success callback, where we get the document object that contains all the info about the model and its viewables
        (doc) => {

            const viewable = doc.getRoot().getDefaultGeometry();

            viewer.loadDocumentNode(doc, viewable);

            console.log("The doc: " + doc);

            const currentUrn = doc.getRoot().data.urn;

            console.log("The urn: " + currentUrn);

            viewer.currentUrn = currentUrn;

            zoomToWalls(viewer);
        },
        //this is the error callback, where we can handle any issues that arise during the loading process
        (err) => console.error(err)
    );

}

export const zoomToWalls = (viewer) => {

    const terms = ["Muro Básico", "Wall", "Basic Wall"];

    const results = new Set();

    let remaining = terms.length;

    terms.forEach(term => {
        viewer.search(term, (dbIds) => {
            dbIds.forEach(id => results.add(id));

            remaining--;

            if (remaining === 0) {
                const ids = [...results];

                viewer.select(ids);
                viewer.isolate(ids);
                viewer.fitToView(ids);

                console.log(ids);
            }
        });
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

export const zoomToRoofs = (viewer) => {

    const terms = ["Cubierta", "Roof", "Techo"];

    const results = new Set();

    let remaining = terms.length;

    terms.forEach(term => {
        viewer.search(term, (dbIds) => {
            dbIds.forEach(id => results.add(id));

            remaining--;

            if (remaining === 0) {
                const ids = [...results];

                viewer.select(ids);
                viewer.isolate(ids);
                viewer.fitToView(ids);

                console.log(ids);
            }
        });
    });
}

export const backToDefaultViewerSetting = (viewer) => {
    {
        const defaultProfile = viewer.profileManager.getProfileOrDefault();
        viewer.setProfile(defaultProfile);

    } (err) => {
        console.error("Back to default Failed:", err);
    }
}

export const initAggregated = (container) => {
    var view = new Autodesk.Viewing.AggregatedView();

    const options = {
        env: 'AutodeskProduction',
        getAccessToken: (onTokenReady) => {
            fetch('/api/token')
                .then(response => response.json())
                .then(data => onTokenReady(data.access_token, data.expires_in));
        }
    };

    Autodesk.Viewing.Initializer(options, function onInitialized() {

        var htmlDiv = document.getElementById('forgeViewer');
        view.init(htmlDiv, options).then(function () {
            Autodesk.Viewing.Document.load(documentId, (doc) => {
                var nodes = doc.getRoot().search({ type: 'geometry' });

                view.setNodes(nodes[0]);
                resolve(viewer);

            }, (errorCode, errorMsg, messages) => {

            });
        });
    })
}