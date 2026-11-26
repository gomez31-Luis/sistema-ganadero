/**
 * ARCHIVO: registro_individual.js
 * PROPÓSITO: Soporte para la vista 'registro-individual.html'.
 * Proporciona validación asíncrona verificando en tiempo real si el ID de Caravana
 * ingresado ya existe en la base de datos (evita duplicados). También muestra notificaciones de éxito.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar notificación si se guardó correctamente
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('exito')) {
        const toast = document.getElementById('toastNotification');
        if (toast) {
            toast.classList.add('active');
            setTimeout(() => toast.classList.remove('active'), 5000);
        }
        window.history.replaceState({}, document.title, "/registro-individual.html");
    }

    // Validación de Caravana duplicada
    let carabanaValida = true;
    const inputCarabana = document.getElementById('carabana');
    const msgSpan = document.getElementById('carabanaMsg');
    const btnGuardar = document.querySelector('button[type="submit"]');
    let debounceTimer;

    if (inputCarabana && msgSpan && btnGuardar) {
        inputCarabana.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            const valor = this.value.trim();
            
            if (valor.length < 2) {
                msgSpan.style.display = 'none';
                inputCarabana.style.borderColor = '';
                carabanaValida = true;
                btnGuardar.disabled = false;
                return;
            }

            debounceTimer = setTimeout(async () => {
                try {
                    const res = await fetch(`/animales/api/verificar/${valor}`);
                    const existe = await res.json();
                    
                    msgSpan.style.display = 'block';
                    if (existe) {
                        msgSpan.innerHTML = '<i class="fas fa-times-circle"></i> Esta Caravana ya está registrada';
                        msgSpan.style.color = '#e74c3c';
                        inputCarabana.style.borderColor = '#e74c3c';
                        carabanaValida = false;
                        btnGuardar.disabled = true;
                    } else {
                        msgSpan.innerHTML = '<i class="fas fa-check-circle"></i> Caravana disponible';
                        msgSpan.style.color = '#27ae60';
                        inputCarabana.style.borderColor = '#27ae60';
                        carabanaValida = true;
                        btnGuardar.disabled = false;
                    }
                } catch (err) {
                    console.error('Error verificando carabana:', err);
                }
            }, 400);
        });
    }
});
