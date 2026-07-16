export default class MarkerPropertyPanel extends Autodesk.Viewing.UI.PropertyPanel {

    constructor(viewer) {
        super(viewer.container, "Marker Properties", "Marker Properties");
    }

    showMarker(object) {

        this.removeAllProperties();

        this.addProperty("Name", object.name);
        this.addProperty("Color", object.color);
        this.addProperty("Id", object.id);
        this.addProperty("City", object.city);

        this.setVisible(true);
    }
}