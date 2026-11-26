/**
 * ARCHIVO: session_timeout.js
 * PROPÓSITO: Detecta inactividad del usuario y cierra sesión automáticamente
 * después de 3 minutos. Muestra una advertencia 30 segundos antes.
 * Se debe incluir en todas las páginas protegidas (menú, listas, formularios).
 */

(function () {
    const TIEMPO_LIMITE_MS   = 3 * 60 * 1000; // 3 minutos en ms
    const AVISO_ANTICIPADO   = 30 * 1000;      // avisar 30 segundos antes
    const URL_LOGOUT         = '/logout';

    let timerLogout;
    let timerAviso;
    let modalVisible = false;

    // ── Crear el modal de advertencia dinámicamente ──────────────────────────
    const modal = document.createElement('div');
    modal.id = 'sessionWarningModal';
    modal.style.cssText = `
        display: none; position: fixed; inset: 0; z-index: 99999;
        background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
        align-items: center; justify-content: center;
    `;
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a2e1a, #0f1f0f);
            border: 1px solid rgba(76,175,80,0.3);
            border-radius: 16px; padding: 36px 32px; max-width: 420px; width: 90%;
            text-align: center; color: #e0e0e0; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        ">
            <i class="fas fa-clock" style="font-size:3rem; color:#f39c12; margin-bottom:16px; display:block;"></i>
            <h2 style="color:#fff; margin:0 0 10px;">¿Sigues ahí?</h2>
            <p style="color:#aaa; margin:0 0 20px; line-height:1.6;">
                Tu sesión se cerrará por inactividad en<br>
                <strong id="sessionCountdown" style="font-size:1.8rem; color:#f39c12;">60</strong> segundos.
            </p>
            <button id="btnContinuarSesion" style="
                background: linear-gradient(135deg, #2d5a27, #4caf50);
                color: white; border: none; border-radius: 8px;
                padding: 12px 30px; font-size: 1rem; font-weight: 600;
                cursor: pointer; width: 100%;
            ">
                <i class="fas fa-check"></i> Continuar sesión
            </button>
        </div>
    `;
    document.body.appendChild(modal);

    // ── Lógica de cuenta regresiva ────────────────────────────────────────────
    let intervaloCuenta;

    function mostrarAviso() {
        if (modalVisible) return;
        modalVisible = true;
        modal.style.display = 'flex';

        let segundos = 30;
        const display = document.getElementById('sessionCountdown');
        if (display) display.textContent = segundos;

        intervaloCuenta = setInterval(() => {
            segundos--;
            if (display) display.textContent = segundos;
            if (segundos <= 0) clearInterval(intervaloCuenta);
        }, 1000);
    }

    function ocultarAviso() {
        modal.style.display = 'none';
        modalVisible = false;
        clearInterval(intervaloCuenta);
    }

    function cerrarSesion() {
        ocultarAviso();
        window.location.href = URL_LOGOUT;
    }

    // ── Reiniciar los temporizadores al detectar actividad ───────────────────
    function resetTimers() {
        if (modalVisible) return; // No resetear si ya está mostrando el aviso
        clearTimeout(timerAviso);
        clearTimeout(timerLogout);

        // Aviso 1 minuto antes del cierre
        timerAviso = setTimeout(mostrarAviso, TIEMPO_LIMITE_MS - AVISO_ANTICIPADO);
        // Cierre de sesión
        timerLogout = setTimeout(cerrarSesion, TIEMPO_LIMITE_MS);
    }

    // ── Botón "Continuar sesión" ─────────────────────────────────────────────
    document.getElementById('btnContinuarSesion').addEventListener('click', () => {
        ocultarAviso();
        resetTimers();
    });

    // ── Detectar cualquier tipo de interacción del usuario ───────────────────
    ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'].forEach(evento => {
        document.addEventListener(evento, resetTimers, { passive: true });
    });

    // ── Arrancar al cargar la página ─────────────────────────────────────────
    resetTimers();
})();
