export default function MiPrimeraExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

MiPrimeraExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MiPrimeraExtension.prototype.constructor = MiPrimeraExtension;

MiPrimeraExtension.prototype.load = function () {
    console.log("MiPrimeraExtension has been loaded.");

    var viewer = this.viewer;
    var botonDeBloqueo = document.getElementById('miPrimerBotonDeBloqueo');
    botonDeBloqueo.addEventListener('click', function () { viewer.setNavigationLock(true); });

    var botonDeDesbloqueo = document.getElementById('miPrimerBotonDeDesbloqueo');
    botonDeDesbloqueo.addEventListener('click', function () { viewer.setNavigationLock(false); });

    return true;
}

MiPrimeraExtension.prototype.unload = function () {
    alert('MiPrimeraExtension is now unloaded!');
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('MiPrimeraExtension', MiPrimeraExtension);