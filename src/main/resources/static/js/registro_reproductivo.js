/**
 * ARCHIVO: registro_reproductivo.js
 * PROPÓSITO: Archivo de soporte para 'registro-reproductivo.html'.
 * Maneja la aparición de notificaciones (toast) si el registro reproductivo
 * fue procesado con éxito y limpia la URL de redirección.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar mensaje de éxito si viene de la redirección
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("exito")) {
        const toast = document.getElementById("toastNotification");
        if (toast) {
            toast.classList.add("active");
            setTimeout(() => toast.classList.remove("active"), 5000);
        }
        window.history.replaceState(
            {},
            document.title,
            "/registro-reproductivo.html"
        );
    }
});
