class SceneBuilderExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
    }

    async load() {
        console.log("SceneBuilderExtension has been loaded.");

        var viewer = this.viewer;

        viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, async () => {

            await viewer.loadExtension('Autodesk.Viewing.SceneBuilder');
            const ext = viewer.getExtension('Autodesk.Viewing.SceneBuilder');

            const modelBuilder = await ext.addNewModel({
                conserveMemory: false,
                modelNameOverride: 'mi nombre de modelo'
            });

            const materials = {
                purple: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 0, 1) }),
                red: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 0, 0) }),
                green: new THREE.MeshPhongMaterial({ color: new THREE.Color(0, 1, 0) }),
                blue: new THREE.MeshPhongMaterial({ color: new THREE.Color(0, 0, 1) })
            };

            // Registrar materiales en el builder
            Object.keys(materials).forEach(name => {
                modelBuilder.addMaterial(name, materials[name]);
            });

            var boxSize = new THREE.BoxGeometry(10, 10, 10);

            var boxPurple = new THREE.BufferGeometry().fromGeometry(boxSize);
            let idBoxPurple = modelBuilder.addGeometry(boxPurple);

            var boxRed = new THREE.BufferGeometry().fromGeometry(boxSize);
            let idBoxRed = modelBuilder.addGeometry(boxRed);

            var boxGreen = new THREE.BufferGeometry().fromGeometry(boxSize);
            let idBoxGreen = modelBuilder.addGeometry(boxGreen);

            var boxBlue = new THREE.BufferGeometry().fromGeometry(boxSize);
            let idBoxBlue = modelBuilder.addGeometry(boxBlue);

            const torusGeom = new THREE.TorusGeometry(100, 3, 16, 100);
            var torusGreen = new THREE.BufferGeometry().fromGeometry(torusGeom);
            let idTorusGreen = modelBuilder.addGeometry(torusGreen);

            const icosaedroGeom = new THREE.IcosahedronGeometry(6, 1);
            var icosahedrumRed = new THREE.BufferGeometry().fromGeometry(icosaedroGeom);
            let idIcoRed = modelBuilder.addGeometry(icosahedrumRed);


            var off = 50

            const transform1 = new THREE.Matrix4().makeTranslation(-off, 0, -5);
            const rY = Math.PI / 4; // Radians
            const rotation = new THREE.Matrix4().makeRotationY(rY);
            const combinedTransform = transform1.multiply(rotation);

            const transform2 = new THREE.Matrix4().makeTranslation(+off, 0, -5);
            const transform3 = new THREE.Matrix4().makeTranslation(0, off, -5);
            const transform4 = new THREE.Matrix4().makeTranslation(0, -off, -5);
            const transformTorus = new THREE.Matrix4().makeTranslation(-0, -0, -10);
            const transformIco = new THREE.Matrix4().makeTranslation(-30, -0, 20);

            modelBuilder.addFragment(idBoxPurple, 'purple', combinedTransform);
            modelBuilder.addFragment(idBoxBlue, 'blue', transform2);
            modelBuilder.addFragment(idBoxGreen, 'green', transform3);
            modelBuilder.addFragment(idBoxRed, 'red', transform4);
            modelBuilder.addFragment(idTorusGreen, 'green', transformTorus);
            modelBuilder.addFragment(idIcoRed, 'red', transformIco);

            // FIX: Check for the function and use the correct order
            if (modelBuilder && typeof modelBuilder.done === 'function') {
                modelBuilder.done();
            } else if (modelBuilder && typeof modelBuilder.consolidate === 'function') {
                modelBuilder.consolidate();
            }

            // Refresh the viewer so the controls "unstick"
            viewer.impl.invalidate(true, true, true);


            return true;
        });

    }

    unload() {
        return true;
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('SceneBuilderExtension', SceneBuilderExtension);

export default SceneBuilderExtension;