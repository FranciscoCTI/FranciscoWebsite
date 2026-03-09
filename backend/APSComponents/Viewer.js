
export function initViewer(container) {
    return new Promise(function (resolve, reject) {

        // 1. Ensure we only initialize the APS environment ONCE
        if (!initializerPromise) {
            initializerPromise = new Promise((res) => {
                Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', getAccessToken }, res);
            });
        }

        initializerPromise.then(() => {
            // 2. Safety check: Ensure container is a DOM element, not a React Ref
            const domElement = container.current || container;

            if (!domElement) {
                return reject("No valid DOM container provided.");
            }

            const config = {
                extensions: ['Autodesk.DocumentBrowser']
            };

            const viewer = new Autodesk.Viewing.GuiViewer3D(domElement, config);

            // 3. Start returns an error code (0 is success)
            const errorCode = viewer.start();
            if (errorCode > 0) {
                console.error('Failed to start viewer:', errorCode);
                return reject(errorCode);
            }

            viewer.setTheme('light-theme');
            resolve(viewer);
        });
    });
}

async function getAccessToken(callback) {
    try {
        const resp = await fetch('/api/token');
        if (!resp.ok) {
            throw new Error(await resp.text());
        }
        const { access_token, expires_in } = await resp.json();
        callback(access_token, expires_in);
    } catch (err) {
        alert('Could not obtain access token. See the console for more details.');
        console.error(err);
    }
}