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
                modelNameOverride: 'geometry model'
            });

            const materials = {
                purple: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 0, 1) }),
                red: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 0, 0) }),
                green: new THREE.MeshPhongMaterial({ color: new THREE.Color(0, 1, 0) }),
                blue: new THREE.MeshPhongMaterial({ color: new THREE.Color(0, 0, 1) })
            };
            console.log("Materials created")

            Object.keys(materials).forEach(name => {
                modelBuilder.addMaterial(name, materials[name]);
            });

            //Slabs
            var slabSize = new THREE.BoxGeometry(100, 100, 1);
            var slabRed = new THREE.BufferGeometry().fromGeometry(slabSize);
            let idSlabRed = modelBuilder.addGeometry(slabRed);

            var slabSizeYellow = new THREE.BoxGeometry(100, 100, 1);
            var slabYellow = new THREE.BufferGeometry().fromGeometry(slabSizeYellow);
            let idSlabYellow = modelBuilder.addGeometry(slabYellow);
            console.log("Box geometry added");

            const transformTopSlab = new THREE.Matrix4().makeTranslation(0, 0, 20);
            const transformBotSlab = new THREE.Matrix4().makeTranslation(0, 0, -14);

            modelBuilder.addFragment(idSlabRed, 'red', transformBotSlab);
            modelBuilder.addFragment(idSlabYellow, 'green', transformTopSlab);

            //Columns
            var column = new THREE.BoxGeometry(2, 2, 35);
            var column1 = new THREE.BufferGeometry().fromGeometry(column);
            var column2 = new THREE.BufferGeometry().fromGeometry(column);
            var column3 = new THREE.BufferGeometry().fromGeometry(column);
            var column4 = new THREE.BufferGeometry().fromGeometry(column);

            var off = 48;
            const transformColumn1 = new THREE.Matrix4().makeTranslation(+off, +off, 2);
            const transformColumn2 = new THREE.Matrix4().makeTranslation(+off, -off, 2);
            const transformColumn3 = new THREE.Matrix4().makeTranslation(-off, -off, 2);
            const transformColumn4 = new THREE.Matrix4().makeTranslation(-off, +off, 2);

            modelBuilder.addFragment(column1, 'red', transformColumn1);
            modelBuilder.addFragment(column2, 'red', transformColumn2);
            modelBuilder.addFragment(column3, 'red', transformColumn3);
            modelBuilder.addFragment(column4, 'red', transformColumn4);
            console.log("Columns created");

            const transformZero = new THREE.Matrix4().makeTranslation(0, 0, 0);

            //Cone
            var cylSize = new THREE.CylinderGeometry(5, 1, 25, 32);
            var cylGeom = new THREE.BufferGeometry().fromGeometry(cylSize);
            let idCyl = modelBuilder.addGeometry(cylGeom);
            const transformCyl = new THREE.Matrix4().makeTranslation(100, 10, -10);
            const rY = Math.PI / 2; // Radians
            const rotation = new THREE.Matrix4().makeRotationX(rY);
            const combinedTransformCyl = transformCyl.multiply(rotation);

            modelBuilder.addFragment(cylGeom, 'red', combinedTransformCyl);

            //Sphere
            var sphereSize = new THREE.SphereGeometry(8, 32, 16);
            var SphGeom = new THREE.BufferGeometry().fromGeometry(sphereSize);
            modelBuilder.addGeometry(SphGeom);
            const transformSph = new THREE.Matrix4().makeTranslation(100, 10, 4);
            modelBuilder.addFragment(SphGeom, 'blue', transformSph);

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