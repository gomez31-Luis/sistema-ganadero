/**
 * ARCHIVO: registro_parto.js
 * PROPÓSITO: Soporte para el formulario 'registro-parto.html'.
 * Inicializa automáticamente el campo de fecha de parto con la fecha actual
 * y controla las alertas de confirmación al guardar exitosamente.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Establecer la fecha de hoy por defecto (con zona horaria local)
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    
    const fechaPartoInput = document.getElementById("fechaParto");
    if (fechaPartoInput) {
        fechaPartoInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // Mostrar notificación profesional
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("exito")) {
        const toast = document.getElementById("toastNotification");
        if (toast) {
            toast.classList.add("active");
            setTimeout(() => toast.classList.remove("active"), 5000);
        }
        window.history.replaceState({}, document.title, "/registro-parto.html");
    }
});
