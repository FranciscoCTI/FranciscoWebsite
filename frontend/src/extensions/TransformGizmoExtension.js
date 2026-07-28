export class TransformGizmoExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.overlayName = 'gizmo-overlay';
        this.activeFragId = null;
        this.isDragging = false;
        this.dragPlane = new THREE.Plane();
        this.planeIntersect = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();

        const materials = {
            purple: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 0, 1) }),
            red: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 0, 0), transparent: true, opacity: 0.7 }),
            green: new THREE.MeshPhongMaterial({ color: new THREE.Color(0, 1, 0) }),
            blue: new THREE.MeshPhongMaterial({ color: new THREE.Color(0, 0, 1) }),
            yellow: new THREE.MeshPhongMaterial({ color: new THREE.Color(1, 1, 0) })
        };
        this.materials = materials;
    }

    registerMaterials(modelBuilder) {
        Object.keys(this.materials).forEach(name => {
            modelBuilder.addMaterial(name, this.materials[name].clone());
        });
    }

    load() {
        if (!this.viewer.impl.overlayScenes[this.overlayName]) {
            this.viewer.impl.createOverlayScene(this.overlayName);
        }

        var viewer = this.viewer;

        viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, async () => {

            await viewer.loadExtension('Autodesk.Viewing.SceneBuilder');
            const ext = viewer.getExtension('Autodesk.Viewing.SceneBuilder');

            this.modelBuilder = await ext.addNewModel({
                conserveMemory: false,
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
        this.detach();
        this.viewer.impl.removeOverlayScene(this.overlayName);
        return true;
    }

    attachToFragment(modelBuilder, fragId) {
        this.detach();
        this.modelBuilder = modelBuilder;
        this.activeFragId = fragId;

        this.gizmoGroup = new THREE.Group();
        const axes = [
            { dir: new THREE.Vector3(1, 0, 0), color: 0xff0000, name: 'x' },
            { dir: new THREE.Vector3(0, 1, 0), color: 0x00ff00, name: 'y' },
            { dir: new THREE.Vector3(0, 0, 1), color: 0x0000ff, name: 'z' }
        ];

        axes.forEach(axis => {
            const arrow = new THREE.ArrowHelper(axis.dir, new THREE.Vector3(0, 0, 0), 10, axis.color, 3, 2);
            arrow.name = axis.name;
            this.gizmoGroup.add(arrow);
        });

        const fragProxy = this.viewer.impl.getFragmentProxy(this.modelBuilder.model, fragId);
        fragProxy.getAnimTransform();
        this.gizmoGroup.position.copy(fragProxy.position);

        this.viewer.impl.addOverlay(this.overlayName, this.gizmoGroup);
        //this.viewer.impl.invalidate(true, true, true);
    }

    detach() {
        if (this.gizmoGroup) {
            this.viewer.impl.removeOverlay(this.overlayName, this.gizmoGroup);
            this.gizmoGroup = null;
        }
        this.activeFragId = null;
        this.viewer.impl.invalidate(true, true, true);
    }

    moveActiveFragment(deltaX, deltaY, deltaZ) {
        if (this.activeFragId == null || !this.modelBuilder) return;

        const fragProxy = this.viewer.impl.getFragmentProxy(this.modelBuilder.model, this.activeFragId);
        fragProxy.getAnimTransform();

        fragProxy.position.x += deltaX;
        fragProxy.position.y += deltaY;
        fragProxy.position.z += deltaZ;

        fragProxy.updateAnimTransform();

        if (this.gizmoGroup) {
            this.gizmoGroup.position.copy(fragProxy.position);
        }

        this.viewer.impl.invalidate(true, true, true);

    }

    async addElementWithGizmo() {
        const viewer = this.viewer;

        this.sceneModel = this.modelBuilder.model;
        this.viewer.impl.unloadModel(this.sceneModel);

        let modelBuilder = this.modelBuilder;

        //this.registerMaterials(modelBuilder);

        let sphereGeom = new THREE.SphereGeometry(15, 32, 16);
        const sphereBuffer = new THREE.BufferGeometry().fromGeometry(sphereGeom);

        let geomId = modelBuilder.addGeometry(sphereBuffer);

        //const sphereBuffer = new THREE.BufferGeometry().fromGeometry(sphereGeom);
        let transform = new THREE.Matrix4().setPosition(50, 0, 0);

        const fragId = modelBuilder.addFragment(geomId, 'yellow', transform);

        // FIX: Check for the function and use the correct order
        if (modelBuilder && typeof modelBuilder.done === 'function') {
            modelBuilder.done();
        } else if (modelBuilder && typeof modelBuilder.consolidate === 'function') {
            modelBuilder.consolidate();
        }

        viewer.impl.sceneUpdated(true);

        viewer.impl.invalidate(true, true, true);

        //this.attachToFragment(modelBuilder, fragId);
        //this.moveActiveFragment(0, 0, 10);
        //viewer.fitToView([fragId], modelBuilder.model);

        return true;
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('TransformGizmoExtension', TransformGizmoExtension);