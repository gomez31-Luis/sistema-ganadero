/**
 * ARCHIVO: login.js
 * PROPÓSITO: Archivo de soporte para 'index.html'.
 * Detecta los parámetros en la URL (como ?error o ?registrado) que envía el servidor
 * y muestra notificaciones Toast interactivas para informar al usuario sobre 
 * el éxito del registro o fallos al iniciar sesión.
 */
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    // Detectar si el usuario se acaba de registrar

    if (urlParams.has('registrado')) {
        showToast('¡Éxito!', 'Cuenta de administrador creada con éxito.', 'fas fa-check-circle', '#2e7d32');
        window.history.replaceState({}, document.title, "/index.html");
    }

    // Detectar si hubo un error en el login
    if (urlParams.has('error')) {
        showToast('Error de Acceso', 'Usuario o contraseña incorrectos.', 'fas fa-exclamation-circle', '#d32f2f');
        window.history.replaceState({}, document.title, "/index.html");
    }

    // Lógica para enviar solicitud de recuperación de contraseña
    const forgotForm = document.getElementById('forgotForm');
    const forgotMessage = document.getElementById('forgotMessage');
    const btnForgot = document.getElementById('btnForgot');
    const emailInput = document.getElementById('forgotEmail');

    if (forgotForm) {
        // Deshabilitar botón por defecto hasta que se verifique el correo
        btnForgot.disabled = true;
        
        // Validación en tiempo real mientras el usuario escribe
        let debounceTimer;
        emailInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const email = emailInput.value;
            
            if (email.length < 5 || !email.includes('@')) {
                btnForgot.disabled = true;
                forgotMessage.textContent = '';
                return;
            }
            
            forgotMessage.style.color = '#fff';
            forgotMessage.textContent = 'Verificando correo...';
            
            debounceTimer = setTimeout(async () => {
                try {
                    const response = await fetch('/api/verificar-email?email=' + encodeURIComponent(email));
                    const existe = await response.json();
                    
                    if (existe) {
                        forgotMessage.style.color = '#4caf50';
                        forgotMessage.textContent = '✓ Correo válido. Puede continuar.';
                        btnForgot.disabled = false;
                    } else {
                        forgotMessage.style.color = '#f44336';
                        forgotMessage.textContent = '✗ Correo no registrado en el sistema.';
                        btnForgot.disabled = true;
                    }
                } catch (error) {
                    forgotMessage.textContent = '';
                }
            }, 500); // Espera 500ms para no saturar el servidor
        });

        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('forgotEmail').value;
            
            btnForgot.disabled = true;
            btnForgot.textContent = 'Enviando...';
            forgotMessage.style.color = '#fff';
            forgotMessage.textContent = 'Procesando solicitud...';

            try {
                const response = await fetch('/api/olvido-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ email })
                });

                const result = await response.text();
                if (response.ok) {
                    forgotMessage.style.color = '#4caf50';
                    forgotMessage.textContent = '✓ ' + result;
                    setTimeout(() => {
                        document.getElementById('forgotModal').classList.remove('active');
                        forgotForm.reset();
                        forgotMessage.textContent = '';
                        btnForgot.disabled = false;
                        btnForgot.textContent = 'Enviar Enlace';
                    }, 4000);
                } else {
                    forgotMessage.style.color = '#f44336';
                    forgotMessage.textContent = '✗ ' + result;
                    btnForgot.disabled = false;
                    btnForgot.textContent = 'Enviar Enlace';
                }
            } catch (error) {
                forgotMessage.style.color = '#f44336';
                forgotMessage.textContent = '✗ Error de conexión.';
                btnForgot.disabled = false;
                btnForgot.textContent = 'Enviar Enlace';
            }
        });
    }
});

function showToast(title, text, icon, color) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    
    const toastTitle = toast.querySelector('.toast-title');
    const toastText = toast.querySelector('.toast-text');
    const toastIcon = toast.querySelector('.toast-content i');
    
    if (toastTitle) toastTitle.textContent = title;
    if (toastText) toastText.textContent = text;
    if (toastIcon) toastIcon.className = icon;
    
    toast.style.borderLeftColor = color;
    if (toastIcon) toastIcon.style.color = color;
    
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 5000);
}
