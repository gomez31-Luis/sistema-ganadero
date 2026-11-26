/**
 * ARCHIVO: restablecer.js
 * PROPÓSITO: Gestionar la lógica de la página de nueva contraseña.
 * Incluye: validación de token, toggle de visibilidad, validación en tiempo real y envío al servidor.
 */
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const cardContent = document.querySelector(".card");

    // 1. Validar que exista el token en la URL
    if (!token) {
        cardContent.innerHTML = `
            <div class="header">
                <h1 style="color: #f44336">Error</h1>
                <p>Falta el token de recuperación. Por favor, use el enlace que llegó a su correo.</p>
                <a href="index.html" style="color: #4caf50; text-decoration: none; margin-top: 15px; display: inline-block; font-weight: 600;">Volver al Inicio</a>
            </div>
        `;
        return;
    }

    // 2. Configurar el Toggle de visibilidad (Ojo)
    setupToggle("togglePass1", "password");
    setupToggle("togglePass2", "confirmPassword");

    // 3. Validación en tiempo real
    const pass1 = document.getElementById("password");
    const pass2 = document.getElementById("confirmPassword");
    const matchMsg = document.getElementById("passwordMatchMessage");
    const btnSubmit = document.getElementById("btnSubmit");

    function validatePasswords() {
        const v1 = pass1.value;
        const v2 = pass2.value;

        if (v2 === "") {
            matchMsg.style.display = "none";
            btnSubmit.disabled = false;
            return;
        }

        matchMsg.style.display = "block";
        if (v1 === v2) {
            matchMsg.textContent = "✓ Las contraseñas coinciden";
            matchMsg.style.color = "#4caf50";
            btnSubmit.disabled = false;
        } else {
            matchMsg.textContent = "✗ Las contraseñas no coinciden";
            matchMsg.style.color = "#f44336";
            btnSubmit.disabled = true;
        }
    }

    pass1.addEventListener("input", validatePasswords);
    pass2.addEventListener("input", validatePasswords);

    // 4. Envío del Formulario
    document.getElementById("resetForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const msgDiv = document.getElementById("message");
        const password = pass1.value;

        try {
            btnSubmit.disabled = true;
            btnSubmit.textContent = "Actualizando...";
            
            const response = await fetch("/api/restablecer-password", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ token, nuevaPassword: password }),
            });

            const result = await response.text();
            if (response.ok) {
                msgDiv.className = "success";
                msgDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${result}<br>Redirigiendo al login...`;
                setTimeout(() => (window.location.href = "index.html"), 3000);
            } else {
                msgDiv.className = "error";
                msgDiv.textContent = result;
                btnSubmit.disabled = false;
                btnSubmit.textContent = "Actualizar Contraseña";
            }
        } catch (error) {
            msgDiv.className = "error";
            msgDiv.textContent = "Error de conexión con el servidor.";
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Actualizar Contraseña";
        }
    });
});

/**
 * Función auxiliar para alternar visibilidad de contraseña
 */
function setupToggle(iconId, inputId) {
    const icon = document.getElementById(iconId);
    const input = document.getElementById(inputId);
    if (icon && input) {
        icon.addEventListener("click", () => {
            const type = input.type === "password" ? "text" : "password";
            input.type = type;
            icon.classList.toggle("fa-eye");
            icon.classList.toggle("fa-eye-slash");
        });
    }
}
