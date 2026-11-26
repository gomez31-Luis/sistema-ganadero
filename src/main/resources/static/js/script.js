/**
 * ARCHIVO: script.js
 * PROPÓSITO: Contiene lógica común compartida por múltiples vistas del sistema.
 * Gestiona el menú desplegable del perfil/usuario, el cerrado de modales universales,
 * validación de contraseñas de registro, previsualización de imágenes y 
 * la visibilidad de contraseñas (icono del ojo en formularios).
 */
// Elementos del Modal
const loginModal = document.getElementById('loginModal');
const openLoginBtn = document.getElementById('openLogin');
const closeModalBtn = document.querySelector('.close-modal');

// Abrir modal
if (openLoginBtn) {
    openLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('active');
    });
}

// Cerrar modal al hacer clic en la (X)
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });
}

// --- Lógica de Dropdowns (soporta múltiples en la misma página) ---
document.querySelectorAll('.dropdown-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Cerrar todos los demás dropdowns abiertos
        document.querySelectorAll('.dropdown-content').forEach(content => {
            if (content !== btn.nextElementSibling) {
                content.classList.remove('active');
            }
        });
        // Abrir/cerrar el dropdown actual
        btn.nextElementSibling.classList.toggle('active');
    });
});

// Modal de Edición
const editModal = document.getElementById('editModal');
const closeEditBtn = document.getElementById('closeEdit');
const editBtns = document.querySelectorAll('.btn-icon:not(.btn-delete)');

if (editBtns) {
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (editModal) editModal.classList.add('active');
        });
    });
}

if (closeEditBtn) {
    closeEditBtn.addEventListener('click', () => {
        if (editModal) editModal.classList.remove('active');
    });
}

// Modal de Registro
const registerModal = document.getElementById('registerModal');
const openRegisterBtn = document.getElementById('openRegister');
const closeRegisterBtn = document.getElementById('closeRegister');

if (openRegisterBtn) {
    openRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginModal) loginModal.classList.remove('active');
        if (registerModal) registerModal.classList.add('active');
    });
}

if (closeRegisterBtn) {
    closeRegisterBtn.addEventListener('click', () => {
        if (registerModal) registerModal.classList.remove('active');
    });
}

// Modal de Olvido de Contraseña
const forgotModal = document.getElementById('forgotModal');
const openForgotBtn = document.getElementById('openForgot');
const closeForgotBtn = document.getElementById('closeForgot');

if (openForgotBtn) {
    openForgotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginModal) loginModal.classList.remove('active');
        if (forgotModal) forgotModal.classList.add('active');
    });
}

if (closeForgotBtn) {
    closeForgotBtn.addEventListener('click', () => {
        if (forgotModal) forgotModal.classList.remove('active');
    });
}

// Cerrar cualquier dropdown al hacer clic fuera
window.addEventListener('click', (e) => {
    if (loginModal && e.target === loginModal) {
        loginModal.classList.remove('active');
    }
    
    if (editModal && e.target === editModal) {
        editModal.classList.remove('active');
    }

    if (registerModal && e.target === registerModal) {
        registerModal.classList.remove('active');
    }

    if (forgotModal && e.target === forgotModal) {
        forgotModal.classList.remove('active');
    }
    
    // Cerrar todos los dropdowns si el clic fue fuera de cualquier dropdown
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content').forEach(content => {
            content.classList.remove('active');
        });
    }
});




// Toggle Password Visibility (Login)
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    if (toggle && input) {
        toggle.addEventListener('click', function() {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

setupPasswordToggle('togglePassword', 'password');
setupPasswordToggle('toggleRegPass', 'regPass');
setupPasswordToggle('toggleRegPassConfirm', 'regPassConfirm');

// Validación de coincidencia de contraseñas
const regPass = document.getElementById('regPass');
const regPassConfirm = document.getElementById('regPassConfirm');
const matchMessage = document.getElementById('passwordMatchMessage');
const btnRegister = document.getElementById('btnRegister');

function validatePasswords() {
    if (regPass && regPassConfirm) {
        const p1 = regPass.value;
        const p2 = regPassConfirm.value;

        if (p2 === "") {
            matchMessage.style.display = 'none';
            btnRegister.disabled = false;
            return;
        }

        matchMessage.style.display = 'block';
        if (p1 === p2) {
            matchMessage.textContent = '✓ Las contraseñas coinciden';
            matchMessage.style.color = '#2e7d32';
            btnRegister.disabled = false;
        } else {
            matchMessage.textContent = '✗ Las contraseñas no coinciden';
            matchMessage.style.color = '#d32f2f';
            btnRegister.disabled = true;
        }
    }
}

if (regPass && regPassConfirm) {
    regPass.addEventListener('input', validatePasswords);
    regPassConfirm.addEventListener('input', validatePasswords);
}

// Previsualización de Foto


const animalPhotoInput = document.getElementById('animalPhoto');
const photoPreview = document.getElementById('photoPreview');

if (animalPhotoInput && photoPreview) {
    animalPhotoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="Vista previa">`;
                photoPreview.style.border = "none";
            }
            reader.readAsDataURL(file);
        }
    });
}

// Smooth scroll para navegación interna (opcional)

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


