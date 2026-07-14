export default class MarkerPropertyPanel extends Autodesk.Viewing.UI.PropertyPanel {

    constructor(viewer) {
        super(viewer.container, "Marker Properties", "Marker Properties");
    }

    showMarker(marker) {

        this.removeAllProperties();

        this.addProperty("Name", marker.userData.name);
        this.addProperty("Color", marker.userData.color);
        this.addProperty("Id", marker.userData.id);
        this.addProperty("City", marker.userData.city);

        this.setVisible(true);
    }
}