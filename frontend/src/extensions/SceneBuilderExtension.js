class SceneBuilderExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
    }

    async load() {
        console.log("SceneBuilderExtension has been loaded.");

        var viewer = this.viewer;

        console.log("The current urn is: " + viewer.currentUrn);

        viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, async () => {

            await viewer.loadExtension('Autodesk.Viewing.SceneBuilder');
            const ext = viewer.getExtension('Autodesk.Viewing.SceneBuilder');

            this.modelBuilder = await ext.addNewModel({
                conserveMemory: false,
                modelNameOverride: 'geometry model'
            });

            const modelBuilder = this.modelBuilder;

            const materials = {
                purple: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 0, 1) }),
                red: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 0, 0), transparent: true, opacity: 0.7 }),
                green: new THREE.MeshPhongMaterial({ color: new THREE.Color(0, 1, 0) }),
                blue: new THREE.MeshPhongMaterial({ color: new THREE.Color(0, 0, 1) }),
                yellow: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 1, 0) })
            };
            console.log("Materials created")

            Object.keys(materials).forEach(name => {
                modelBuilder.addMaterial(name, materials[name]);
            });

            /*
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
            */

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

        return true;
    }

    unload() {
        return true;
    }

    async createBigSphere() {
        console.log("Some action from the extension");

        var viewer = this.viewer;

        console.log("The current urn is: " + viewer.currentUrn);

        const modelBuilder = this.modelBuilder;

        //Sphere
        if (viewer.currentUrn == "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9Qcm95ZWN0b0Nhc2FfMjAyNV9hLnJ2dA") {
            var sphereSize = new THREE.SphereGeometry(10, 32, 16);
            var SphGeom = new THREE.BufferGeometry().fromGeometry(sphereSize);
            modelBuilder.addGeometry(SphGeom);
            const transformSph = new THREE.Matrix4().makeTranslation(-50, -50, -10);
            modelBuilder.addFragment(SphGeom, 'blue', transformSph);
        }

        // FIX: Check for the function and use the correct order
        if (modelBuilder && typeof modelBuilder.done === 'function') {
            modelBuilder.done();
        } else if (modelBuilder && typeof modelBuilder.consolidate === 'function') {
            modelBuilder.consolidate();
        }

        // Refresh the viewer so the controls "unstick"
        viewer.impl.invalidate(true, true, true);


        return true;
    }

    async createBuildingClearance() {
        console.log("Creating clearance");

        var viewer = this.viewer;

        const modelBuilder = this.modelBuilder;

        const urn = viewer.currentUrn;

        let fragments = modelBuilder.model.getFragmentList();

        //fragments = modelBuilder.sceneFragments || modelBuilder.fragments;

        if (fragments && fragments.geoms.geoms.length > 1) {
            return false;
        }

        if (urn) {
            switch (urn) {
                case "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9Qcm95ZWN0b0Nhc2FfMjAyNV9hLnJ2dA":

                    this.createHouseClearance(modelBuilder);

                    break;

                case "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9DQ1NfRVNUXzAxLnJ2dA":

                    this.createTunnelClearance(modelBuilder);

                    break;

                case "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9DQVBKX0NlbnRybyUyMGRlJTIwSnVzdGljaWElMjBWYWxkaXZpYShFc3QpLnJ2dA":

                    this.createJuditialClearance(modelBuilder);

                    break;

                default:
                    break;
            }

        }

    }

    createHouseClearance(modelBuilder) {
        var slabSize = new THREE.BoxGeometry(75, 65, 29);
        var slabRed = new THREE.BufferGeometry().fromGeometry(slabSize);
        var idSlabRed = modelBuilder.addGeometry(slabRed);

        console.log("Box geometry added");

        var transformBotSlab = new THREE.Matrix4().makeTranslation(0, 0, 0);

        modelBuilder.addFragment(idSlabRed, 'red', transformBotSlab);
        return true;
    }

    createTunnelClearance(modelBuilder) {
        var slabSize = new THREE.BoxGeometry(300, 35, 35);
        var slabRed = new THREE.BufferGeometry().fromGeometry(slabSize);
        var idSlabRed = modelBuilder.addGeometry(slabRed);

        var transformBotSlab = new THREE.Matrix4().makeTranslation(0, 0, -5);

        modelBuilder.addFragment(idSlabRed, 'red', transformBotSlab);
        return true;
    }

    createJuditialClearance(modelBuilder) {
        var slabSize = new THREE.BoxGeometry(400, 130, 100);
        var slabRed = new THREE.BufferGeometry().fromGeometry(slabSize);
        var idSlabRed = modelBuilder.addGeometry(slabRed);

        var transformBotSlab = new THREE.Matrix4().makeTranslation(0, 0, -5);

        modelBuilder.addFragment(idSlabRed, 'red', transformBotSlab);
        return true;
    }

    async markAccessPoints() {
        console.log("Creating access points");

        var viewer = this.viewer;

        const modelBuilder = this.modelBuilder;

        const urn = viewer.currentUrn;

        const shape = new THREE.Shape();

        shape.moveTo(0, 0);
        shape.lineTo(1, 0);
        shape.lineTo(1, 2);
        shape.lineTo(2, 2);
        shape.lineTo(0, 4);
        shape.lineTo(-2, 2);
        shape.lineTo(-1, 2);
        shape.lineTo(-1, 0);
        shape.lineTo(0, 0);

        const extrudeSettings = {
            amount: 0.3,          // r71 uses "amount", not "depth"
            bevelEnabled: false,
            steps: 1
        };

        const extrudeGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        //Acces 1
        const accesArrow1 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow1);
        const transformAccesArrow1 = new THREE.Matrix4().makeTranslation(-30, 2.5, -8);

        const rZ = Math.PI / 2; // Radians
        const rotation90 = new THREE.Matrix4().makeRotationZ(-rZ);
        const combinedTransformArr1 = transformAccesArrow1.multiply(rotation90);
        modelBuilder.addFragment(accesArrow1, 'yellow', combinedTransformArr1);

        //Acces 2
        const accesArrow2 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow2);
        const transformAccesArrow2 = new THREE.Matrix4().makeTranslation(9, -22, -8);
        modelBuilder.addFragment(accesArrow2, 'yellow', transformAccesArrow2);

        //Acces 3
        const accesArrow3 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow3);
        const transformAccesArrow3 = new THREE.Matrix4().makeTranslation(0, -16, -8);
        const rotation90Counter = new THREE.Matrix4().makeRotationZ(rZ);
        const combinedTransformArr3 = transformAccesArrow3.multiply(rotation90Counter);
        modelBuilder.addFragment(accesArrow3, 'yellow', combinedTransformArr3);

        //Acces 4
        const accesArrow4 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow4);
        const transformAccesArrow4 = new THREE.Matrix4().makeTranslation(24, 7, -8);

        const rotation45 = new THREE.Matrix4().makeRotationZ(rZ - (rZ / 2));
        const combinedTransformArr4 = transformAccesArrow4.multiply(rotation45).multiply(rotation90Counter);
        modelBuilder.addFragment(accesArrow4, 'yellow', combinedTransformArr4);

        //Acces 5
        const accesArrow5 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow5);
        const transformAccesArrow5 = new THREE.Matrix4().makeTranslation(11, 11, -8);

        const rZ180 = Math.PI;
        const rotation180 = new THREE.Matrix4().makeRotationZ(rZ180);
        const combinedTransformArr5 = transformAccesArrow5.multiply(rotation180);
        modelBuilder.addFragment(accesArrow5, 'yellow', combinedTransformArr5);









        return true;
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('SceneBuilderExtension', SceneBuilderExtension);

export default SceneBuilderExtension;