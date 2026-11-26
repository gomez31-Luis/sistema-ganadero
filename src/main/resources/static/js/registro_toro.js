/**
 * ARCHIVO: registro_toro.js
 * PROPÓSITO: Soporte para 'registro-toro.html'.
 * Pre-llena la fecha de compra del toro con el día actual por conveniencia del usuario.
 * Controla el Toast de éxito tras guardar.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Establecer la fecha de hoy por defecto
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const fechaCompraInput = document.getElementById("fechaCompra");
    
    if (fechaCompraInput) {
        fechaCompraInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // Mostrar notificación
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("exito")) {
        const toast = document.getElementById("toastNotification");
        if (toast) {
            toast.classList.add("active");
            setTimeout(() => toast.classList.remove("active"), 5000);
        }
        window.history.replaceState({}, document.title, "/registro-toro.html");
    }

    // Validación de Caravana ID duplicada
    const inputIdToro = document.getElementById('idToro');
    const msgSpan = document.getElementById('carabanaMsg');
    const btnGuardar = document.querySelector('button[type="submit"]');
    let debounceTimer;

    if (inputIdToro && msgSpan && btnGuardar) {
        inputIdToro.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            const valor = this.value.trim();
            
            if (valor.length < 2) {
                msgSpan.style.display = 'none';
                inputIdToro.style.borderColor = '';
                btnGuardar.disabled = false;
                return;
            }

            debounceTimer = setTimeout(async () => {
                try {
                    const res = await fetch(`/toros/api/verificar/${valor}`);
                    const existe = await res.json();
                    
                    msgSpan.style.display = 'block';
                    if (existe) {
                        msgSpan.innerHTML = '<i class="fas fa-times-circle"></i> Esta Caravana ya está en uso';
                        msgSpan.style.color = '#e74c3c';
                        inputIdToro.style.borderColor = '#e74c3c';
                        btnGuardar.disabled = true;
                    } else {
                        msgSpan.innerHTML = '<i class="fas fa-check-circle"></i> Caravana disponible';
                        msgSpan.style.color = '#27ae60';
                        inputIdToro.style.borderColor = '#27ae60';
                        btnGuardar.disabled = false;
                    }
                } catch (err) {
                    console.error('Error verificando ID de toro:', err);
                }
            }, 400);
        });
    }
});
