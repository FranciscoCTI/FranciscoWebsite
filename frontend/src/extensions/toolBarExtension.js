export default function ToolBarExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

ToolBarExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ToolBarExtension.prototype.constructor = ToolBarExtension;

ToolBarExtension.prototype.load = function () {
    console.log("ToolBarExtension has been loaded.");
    this.viewer.setLightPreset(6);
    this.viewer.setEnvMapBackground(true);
    this.viewer.fitToView();
    return true;
};

ToolBarExtension.prototype.unload = function () {
    alert('ToolBarExtension is now unloaded!');
    if (this.subToolbar) {
        this.viewer.toolbar.removeControl(this.subToolbar);
        this.subToolbar = null;
    }
};

ToolBarExtension.prototype.onToolbarCreated = function () {
    var viewer = this.viewer;

    var button1 = new Autodesk.Viewing.UI.Button('show-env-bg-btn');
    button1.onClick = function (e) {
        viewer.setEnvMapBackground(true);
    };
    button1.setToolTip('Show Environment Background');
    button1.addClass('show-env-bg-btn');

    var button2 = new Autodesk.Viewing.UI.Button('hide-env-bg-button');
    button2.onClick = function (e) {
        viewer.setEnvMapBackground(false);
    };
    button2.addClass('hide-env-bg-btn');
    button2.setToolTip('Hide Environment');

    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-custom-toolbar');
    this.subToolbar.addControl(button1);
    this.subToolbar.addControl(button2);

    this.viewer.toolbar.addControl(this.subToolbar);
}

Autodesk.Viewing.theExtensionManager.registerExtension('ToolBarExtension', ToolBarExtension);