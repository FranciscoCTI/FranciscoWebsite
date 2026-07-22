import MarkerPropertyPanel from '../classes/propertyPanel';

class SceneBuilderExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);

        this.markerPanel = new MarkerPropertyPanel(viewer);

        const materials = {
            purple: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 0, 1) }),
            red: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 0, 0), transparent: true, opacity: 0.7 }),
            green: new THREE.MeshPhongMaterial({ color: new THREE.Color(0, 1, 0) }),
            blue: new THREE.MeshPhongMaterial({ color: new THREE.Color(0, 0, 1) }),
            yellow: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 1, 0) })
        };
        this.materials = materials;

        this.markerProperties = {};

        this.instanceId = Math.random().toString(36).substring(2, 8);
        console.log("Constructor:", this.instanceId);

        //Set up raycasting
        viewer.impl.canvas.addEventListener("click", (e) => {
            this.onCanvasClick(e);
        });
    }

    onCanvasClick(event) {

        const THREE = window.THREE;

        const rect = this.viewer.impl.canvas.getBoundingClientRect();

        const hit = this.viewer.impl.hitTest(
            event.clientX - rect.left,
            event.clientY - rect.top,
            true
        );

        if (hit) {
            //alert("This is the BIM model: " + hit.dbId);

            const props = this.markerProperties[hit.object.geometry.id];

            this.markerPanel.showMarker(props);

        } else {
            if (this.markerPanel) {
                this.markerPanel.setVisible(false);
            }
        }

    }

    registerMaterials(modelBuilder) {
        Object.keys(this.materials).forEach(name => {
            modelBuilder.addMaterial(name, this.materials[name].clone());
        });


    }


    async load() {
        console.log("SceneBuilderExtension has been loaded.");

        var viewer = this.viewer;

        console.log("The current urn is: " + viewer.currentUrn);

        console.log("SceneBuilderExtension instance id:", this.instanceId);


        viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, async () => {

            await viewer.loadExtension('Autodesk.Viewing.SceneBuilder');
            const ext = viewer.getExtension('Autodesk.Viewing.SceneBuilder');

            this.modelBuilder = await ext.addNewModel({
                conserveMemory: true,
                modelNameOverride: 'geometry model'
            });

            const modelBuilder = this.modelBuilder;

            this.registerMaterials(modelBuilder);

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

        const viewer = this.viewer;
        const camera = viewer.navigation.getCamera();

        console.log("The camera position: " + camera.position);
        console.log("The camera target: " + camera.target);

        viewer.select([]);
        viewer.isolate([]);

        if (viewer.selectionSet) {
            viewer.selectionSet.clear();
        }

        const ext = viewer.getExtension('Autodesk.Viewing.SceneBuilder');

        // 1. Get the total count of fragments in this modelBuilder instance
        let modelBuilder = this.modelBuilder;
        const count = modelBuilder.fragList.getCount();

        // 2. Loop backwards from the end to remove each fragment
        for (let fragId = count - 1; fragId >= 0; fragId--) {
            modelBuilder.removeFragment(fragId);
        }

        this.sceneModel = this.modelBuilder.model;
        this.viewer.impl.unloadModel(this.sceneModel);

        modelBuilder = await ext.addNewModel({
            conserveMemory: false,
            modelNameOverride: 'geometry model'
        });

        this.modelBuilder = modelBuilder;

        this.registerMaterials(modelBuilder);

        const urn = viewer.currentUrn;

        let fragments = modelBuilder.model.getFragmentList();

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

    }

    createHouseClearance(modelBuilder) {
        var slabSize = new THREE.BoxGeometry(75, 65, 29);
        var slabRed = new THREE.BufferGeometry().fromGeometry(slabSize);
        var idSlabRed = modelBuilder.addGeometry(slabRed);

        console.log("Box geometry added");

        var transformBotSlab = new THREE.Matrix4().makeTranslation(0, 0, 0);

        this.registerMaterials(modelBuilder);

        modelBuilder.addFragment(idSlabRed, 'red', transformBotSlab);

    }

    createTunnelClearance(modelBuilder) {
        var slabSize = new THREE.BoxGeometry(300, 35, 35);
        var slabRed = new THREE.BufferGeometry().fromGeometry(slabSize);
        var idSlabRed = modelBuilder.addGeometry(slabRed);

        var transformBotSlab = new THREE.Matrix4().makeTranslation(0, 0, -5);

        modelBuilder.addFragment(idSlabRed, 'red', transformBotSlab);

    }

    createJuditialClearance(modelBuilder) {
        var slabSize = new THREE.BoxGeometry(400, 130, 100);
        var slabRed = new THREE.BufferGeometry().fromGeometry(slabSize);
        var idSlabRed = modelBuilder.addGeometry(slabRed);

        var transformBotSlab = new THREE.Matrix4().makeTranslation(0, 0, -5);

        modelBuilder.addFragment(idSlabRed, 'red', transformBotSlab);

    }

    async createMarker(position) {
        console.log("Creating marker at " + position.toString());

        let modelBuilder = this.modelBuilder;

        const sphereGeom = new THREE.SphereGeometry(5, 32, 16);

        const sphereBuffer = new THREE.BufferGeometry().fromGeometry(sphereGeom);

        modelBuilder.addGeometry(sphereBuffer);

        let transformSphere = new THREE.Matrix4();

        let geomId = 0;
        let aDescription = '-';
        let aColor = "";

        switch (position) {
            case PositionAtTunnel.START:
                transformSphere = new THREE.Matrix4().makeTranslation(-155, 0, -8);
                aDescription = 'This is the start of the tunnel ';
                aColor = "yellow";
                break;
            case PositionAtTunnel.EXITA:
                transformSphere = new THREE.Matrix4().makeTranslation(135, 20, -8);
                aDescription = 'Waste exit to the sewer';
                aColor = "blue";
                break;
            case PositionAtTunnel.EXITB:
                transformSphere = new THREE.Matrix4().makeTranslation(150, -15, -8);
                aDescription = 'Waste exit to the treatment plant';
                aColor = "green";
                break;
            default:
                console.warn("Unknown tunnel position:", position);
                transformSphere = new THREE.Matrix4(); // Identity matrix
                break;
        }


        geomId = sphereBuffer.id;

        let userData = {
            name: position.toString(),
            description: aDescription,
            color: aColor,
            id: geomId,
        };

        this.markerProperties[geomId] = userData;

        modelBuilder.addFragment(sphereBuffer, aColor, transformSphere, { dbId: geomId });

    }


    async markAccessPoints() {
        console.log("Creating access points");

        var viewer = this.viewer;

        this.sceneModel = this.modelBuilder.model;
        this.viewer.impl.unloadModel(this.sceneModel);

        const ext = viewer.getExtension('Autodesk.Viewing.SceneBuilder');

        const modelBuilder = await ext.addNewModel({
            conserveMemory: true,
            modelNameOverride: 'geometry model'
        });

        this.modelBuilder = modelBuilder;

        this.registerMaterials(modelBuilder);

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
            amount: 0.3,
            bevelEnabled: false,
            steps: 1
        };

        const extrudeGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        let fragments = modelBuilder.model.getFragmentList();

        if (fragments && fragments.geoms.geoms.length > 1) {
            return false;
        }

        if (urn) {
            switch (urn) {
                case "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9Qcm95ZWN0b0Nhc2FfMjAyNV9hLnJ2dA":

                    //Acces 1
                    this.AccessArrowsInHouse(extrudeGeom, modelBuilder);

                    break;

                case "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9DQ1NfRVNUXzAxLnJ2dA":

                    this.AccessArrowsInTunnel(extrudeGeom, modelBuilder);

                    break;

                case "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9DQVBKX0NlbnRybyUyMGRlJTIwSnVzdGljaWElMjBWYWxkaXZpYShFc3QpLnJ2dA":

                    this.AccessArrowsInJuditial(extrudeGeom, modelBuilder);

                    break;

                default:
                    break;
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
        return true;
    }

    async goToBookShelf() {
        console.log("Moving camera to bookshelf");

        var viewer = this.viewer;
        viewer.navigation.toPerspective();

        const position = new THREE.Vector3(-6.58, -5.19, -6.30);
        const target = new THREE.Vector3(1.54, 111.19, -53.88);

        await this.goToPlace(viewer, position, target);

    }

    async goToKitchen() {
        console.log("Moving camera to kitchen");

        var viewer = this.viewer;
        viewer.navigation.toPerspective();

        const position = new THREE.Vector3(4.94, 4.40, -6.30);
        const target = new THREE.Vector3(31.44, -108.82, -54.77);

        await this.goToPlace(viewer, position, target);
    }

    async goToMasterBedroom() {
        console.log("Moving camera to master bedroom");

        var viewer = this.viewer;
        viewer.navigation.toPerspective();

        const position = new THREE.Vector3(-20.65, -24.10, - 6.30);
        const target = new THREE.Vector3(99.27, -3.25, -38.77);

        await this.goToPlace(viewer, position, target);
    }

    async goToKidsBedroom() {
        console.log("Moving camera to kids' bedroom");

        var viewer = this.viewer;
        viewer.navigation.toPerspective();

        const position = new THREE.Vector3(-4.32, -3.97, 2.22);
        const target = new THREE.Vector3(68.12, -91.88, -51.59);

        await this.goToPlace(viewer, position, target);
    }

    async goToPlace(viewer, position, target) {

        viewer.navigation.setView(position, target);

        viewer.prefs.set('bimWalkToolPopup', false);

        viewer.setActiveNavigationTool("bimwalk");

        this.setCameraUp();

        console.log("Camera moved succesfully");
    }

    setCameraUp() {
        var viewer = this.viewer;

        viewer.navigation.setWorldUpVector(
            new THREE.Vector3(0, 0, 1),
            true
        );

        viewer.navigation.orientCameraUp();
    }

    AccessArrowsInHouse(extrudeGeom, modelBuilder) {
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
    }

    AccessArrowsInTunnel(extrudeGeom, modelBuilder) {
        const accesArrow1 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow1);
        const transformAccesArrow1 = new THREE.Matrix4().makeTranslation(133, 15, -8);
        const rZ = Math.PI; // Radians
        const rotation90 = new THREE.Matrix4().makeRotationZ(rZ);
        const combinedTransformArr1 = transformAccesArrow1.multiply(rotation90);
        modelBuilder.addFragment(accesArrow1, 'yellow', combinedTransformArr1);

        const accesArrow2 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow2);
        const transformAccesArrow2 = new THREE.Matrix4().makeTranslation(138, 15, -8);
        const combinedTransformArr2 = transformAccesArrow2.multiply(rotation90);
        modelBuilder.addFragment(accesArrow2, 'yellow', combinedTransformArr2);

        const accesArrow3 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow3);
        const transformAccesArrow3 = new THREE.Matrix4().makeTranslation(149, -13, -8);
        const rZ45 = Math.PI / 4; // Radians
        const rotation45 = new THREE.Matrix4().makeRotationZ(rZ45);
        const combinedTransformArr3 = transformAccesArrow3.multiply(rotation45);
        modelBuilder.addFragment(accesArrow3, 'yellow', combinedTransformArr3);

        const accesArrow4 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow4);
        const transformAccesArrow4 = new THREE.Matrix4().makeTranslation(-150, -2, -8);
        const rZCounter = Math.PI / 2; // Radians
        const rotation90Counter = new THREE.Matrix4().makeRotationZ(-rZCounter);
        const combinedTransformArr4 = transformAccesArrow4.multiply(rotation90Counter);
        modelBuilder.addFragment(accesArrow4, 'yellow', combinedTransformArr4);

        /*
        
        modelBuilder.addFragment(accesArrow1, 'yellow', combinedTransformArr1);

        //Acces 2
        const accesArrow2 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow2);
        const transformAccesArrow2 = new THREE.Matrix4().makeTranslation(9, -22, -8);
        //modelBuilder.addFragment(accesArrow2, 'yellow', transformAccesArrow2);

        //Acces 3
        const accesArrow3 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow3);
        const transformAccesArrow3 = new THREE.Matrix4().makeTranslation(0, -16, -8);
        const rotation90Counter = new THREE.Matrix4().makeRotationZ(rZ);
        const combinedTransformArr3 = transformAccesArrow3.multiply(rotation90Counter);
        //modelBuilder.addFragment(accesArrow3, 'yellow', combinedTransformArr3);

        //Acces 4
        const accesArrow4 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow4);
        const transformAccesArrow4 = new THREE.Matrix4().makeTranslation(24, 7, -8);

        const rotation45 = new THREE.Matrix4().makeRotationZ(rZ - (rZ / 2));
        const combinedTransformArr4 = transformAccesArrow4.multiply(rotation45).multiply(rotation90Counter);
        //modelBuilder.addFragment(accesArrow4, 'yellow', combinedTransformArr4);

        //Acces 5
        const accesArrow5 = new THREE.BufferGeometry().fromGeometry(extrudeGeom);
        modelBuilder.addGeometry(accesArrow5);
        const transformAccesArrow5 = new THREE.Matrix4().makeTranslation(11, 11, -8);

        const rZ180 = Math.PI;
        const rotation180 = new THREE.Matrix4().makeRotationZ(rZ180);
        const combinedTransformArr5 = transformAccesArrow5.multiply(rotation180);
        //modelBuilder.addFragment(accesArrow5, 'yellow', combinedTransformArr5);
        */
    }

    AccessArrowsJuditial(extrudeGeom, modelBuilder) {
        /*
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
        */
    }

    async AddElementWithInteractivity() {

        const viewer = this.viewer;

        this.sceneModel = this.modelBuilder.model;
        this.viewer.impl.unloadModel(this.sceneModel);

        const ext = viewer.getExtension('Autodesk.Viewing.SceneBuilder');

        const modelBuilder = await ext.addNewModel({
            conserveMemory: false,
            modelNameOverride: 'geometry model'
        });

        this.modelBuilder = modelBuilder;

        this.registerMaterials(modelBuilder);

        this.createMarker(PositionAtTunnel.START);
        this.createMarker(PositionAtTunnel.EXITA);
        this.createMarker(PositionAtTunnel.EXITB);


        // FIX: Check for the function and use the correct order
        if (modelBuilder && typeof modelBuilder.done === 'function') {
            modelBuilder.done();
        } else if (modelBuilder && typeof modelBuilder.consolidate === 'function') {
            modelBuilder.consolidate();
        }

        // Redraw
        viewer.impl.invalidate(true, true, true);

        console.log("Added interactive ball overlay");

        return true;
    }
}

export const PositionAtTunnel = Object.freeze({
    START: "Start",
    EXITA: "Exit A",
    EXITB: "Exit B"
});

Autodesk.Viewing.theExtensionManager.registerExtension('SceneBuilderExtension', SceneBuilderExtension);

export default SceneBuilderExtension;