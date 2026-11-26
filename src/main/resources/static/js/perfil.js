/**
 * ARCHIVO: perfil.js
 * PROPÓSITO: Maneja el modal de "Mi Perfil" en menu.html.
 * Carga los datos del usuario logueado, permite editarlos y
 * enviarlos al servidor para actualizar nombre, email y contraseña.
 */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('perfilModal');
    const btnAbrir = document.getElementById('btnMiPerfil');
    const btnCerrar = document.getElementById('closePerfilModal');
    const form = document.getElementById('formPerfil');

    // Abrir modal y cargar datos del perfil actual
    if (btnAbrir) {
        btnAbrir.addEventListener('click', async (e) => {
            e.preventDefault();
            // Cerrar el dropdown
            document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('active'));
            
            try {
                const res = await fetch('/api/perfil');
                if (!res.ok) throw new Error('No autorizado');
                const datos = await res.json();
                
                document.getElementById('perfilUsername').value = datos.username || '';
                document.getElementById('perfilNombre').value = datos.nombreCompleto || '';
                document.getElementById('perfilEmail').value = datos.email || '';
                document.getElementById('perfilPassword').value = '';
            } catch (err) {
                console.error('Error cargando perfil:', err);
            }

            modal.classList.add('active');
        });
    }

    // Cerrar modal
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => modal.classList.remove('active'));
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // Toggle visibilidad de contraseña
    const togglePass = document.getElementById('togglePerfilPass');
    const passInput = document.getElementById('perfilPassword');
    if (togglePass && passInput) {
        togglePass.addEventListener('click', () => {
            const type = passInput.type === 'password' ? 'text' : 'password';
            passInput.type = type;
            togglePass.classList.toggle('fa-eye');
            togglePass.classList.toggle('fa-eye-slash');
        });
    }

    // Enviar formulario de actualización
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
        const nuevoUsername = document.getElementById('perfilUsername').value.trim();
        const nombreCompleto = document.getElementById('perfilNombre').value.trim();
        const email = document.getElementById('perfilEmail').value.trim();
        const nuevaPassword = document.getElementById('perfilPassword').value;

        const params = new URLSearchParams({ nuevoUsername, nombreCompleto, email });
        if (nuevaPassword) params.append('nuevaPassword', nuevaPassword);

            try {
                const res = await fetch('/api/perfil/actualizar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString()
                });

                if (res.ok) {
                    const data = await res.json();
                    document.getElementById('perfilPassword').value = '';
                    
                    if (data.relogin) {
                        // Username cambió: avisar y cerrar sesión para re-autenticar
                        mostrarToast('Usuario actualizado. Iniciando sesión de nuevo...', 'success');
                        setTimeout(() => { window.location.href = '/logout'; }, 2500);
                    } else {
                        mostrarToast('Perfil actualizado con éxito', 'success');
                    }
                } else {
                    mostrarToast('Error al actualizar el perfil', 'error');
                }
            } catch (err) {
                console.error('Error:', err);
                mostrarToast('Error de conexión', 'error');
            }
        });
    }
});

function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastText = document.getElementById('toastText');
    const toastIcon = document.getElementById('toastIcon');
    if (!toast) return;

    toastText.textContent = mensaje;
    if (tipo === 'success') {
        toastTitle.textContent = '¡Éxito!';
        toastTitle.style.color = 'var(--primary-light)';
        toastIcon.className = 'fas fa-check-circle';
        toastIcon.style.color = 'var(--primary-light)';
    } else {
        toastTitle.textContent = 'Error';
        toastTitle.style.color = '#e74c3c';
        toastIcon.className = 'fas fa-exclamation-circle';
        toastIcon.style.color = '#e74c3c';
    }
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
}
