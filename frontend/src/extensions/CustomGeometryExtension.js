export default function CustomGeometryExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

CustomGeometryExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
CustomGeometryExtension.prototype.constructor = CustomGeometryExtension;

CustomGeometryExtension.prototype.load = function () {
    console.log("CustomGeometryExtension has been loaded.");

    var viewer = this.viewer;

    if (!viewer.overlays.hasScene('custom-scene')) {
        viewer.overlays.addScene('custom-scene');
    }

    var geom = new THREE.SphereGeometry(10, 28, 28);

    var material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });


    var zIndex = 500;

    while (zIndex > 0) {
        var materialParalele = new THREE.MeshBasicMaterial({ color: "#ff4500", wireframe: true });
        var aBox = new THREE.BoxGeometry(20, 10, 3);
        var paralelepiped = new THREE.Mesh(aBox, materialParalele);
        paralelepiped.position.set(-50, -50, zIndex);
        viewer.overlays.addMesh(paralelepiped, "custom-scene");

        zIndex -= 10;
    }

    var index = 50;
    while (index < 1000) {
        var sphere = new THREE.Mesh(geom, material);
        sphere.position.set(index, 0, 0);
        viewer.overlays.addMesh(sphere, "custom-scene");

        var otherIndex = 0;
        while (otherIndex < 1000) {
            var torusGeom = new THREE.TorusGeometry(20, 5, 10, 100);
            var torus = new THREE.Mesh(torusGeom, material);
            torus.position.set(index, otherIndex, 0);
            viewer.overlays.addMesh(torus, "custom-scene");

            var otherOtherIndex = 0;

            while (otherOtherIndex < 1000) {
                var boxGeom = new THREE.BoxGeometry(10, 10, 20);
                var box = new THREE.Mesh(boxGeom, material);
                box.position.set(index, otherIndex, otherOtherIndex);
                viewer.overlays.addMesh(box, "custom-scene");
                otherOtherIndex += 50;
            }
            otherIndex += 50;
        }
        index += 50;
    }
    return true;
};

CustomGeometryExtension.prototype.unload = function () {

};

Autodesk.Viewing.theExtensionManager.registerExtension('CustomGeometryExtension', CustomGeometryExtension);