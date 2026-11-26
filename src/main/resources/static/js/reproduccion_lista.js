/**
 * ARCHIVO: reproduccion_lista.js
 * PROPÓSITO: Maneja la lógica de 'ver-reproductivo.html'.
 * Administra el listado de eventos reproductivos, cálculo automático de fechas probables de parto
 * (basado en la fecha de inseminación), edición, eliminación y paginación.
 */
let reproData = [];
let idParaEliminar = null;
let currentPage = 1;
const itemsPerPage = 4;

document.addEventListener('DOMContentLoaded', function() {
    cargarRegistrosRepro();
    configurarBuscadorRepro();
    configurarBotonesModal();
});

/**
 * Carga los registros desde el servidor
 */
async function cargarRegistrosRepro() {
    try {
        const response = await fetch('/reproduccion/api/listar');
        reproData = await response.json();
        currentPage = 1;
        renderizarTablaRepro(reproData);
    } catch (error) {
        console.error('Error al cargar historial reproductivo:', error);
    }
}

/**
 * Renderiza la tabla de reproducción
 */
function renderizarTablaRepro(lista) {
    const tbody = document.getElementById('reproTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = ''; 

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsPaginados = lista.slice(startIndex, endIndex);

    // Función auxiliar para evitar problemas de zona horaria al mostrar fechas
    const formatearFechaLocal = (fechaStr) => {
        if (!fechaStr) return 'N/A';
        const [year, month, day] = fechaStr.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    itemsPaginados.forEach(reg => {
        const row = document.createElement('tr');
        
        // Formatear fechas de forma segura
        const fCelo = formatearFechaLocal(reg.fechaCelo);
        const fIns = formatearFechaLocal(reg.fechaInseminacion);
        const fParto = reg.fechaParto ? formatearFechaLocal(reg.fechaParto) : 'Pendiente';
        
        row.innerHTML = `
            <td><strong>${reg.idVaca}</strong></td>
            <td>${reg.nombreVaca || 'N/A'}</td>
            <td>${fCelo}</td>
            <td>${fIns}</td>
            <td>${reg.toroSemen || 'N/A'}</td>
            <td><span class="date-badge">${fParto}</span></td>
            <td class="actions">
                <button class="btn-icon" title="Editar" onclick="prepararEdicion('${reg.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" title="Eliminar" onclick="abrirModalEliminar('${reg.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    renderizarPaginacionRepro(lista);
}

function renderizarPaginacionRepro(lista) {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(lista.length / itemsPerPage);
    
    if (totalPages <= 1) return;

    // Botón Anterior «
    const btnPrev = document.createElement('button');
    btnPrev.classList.add('page-btn');
    btnPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
    btnPrev.disabled = currentPage === 1;
    btnPrev.onclick = () => { currentPage--; renderizarTablaRepro(lista); };
    paginationContainer.appendChild(btnPrev);

    // Botones numéricos
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.classList.add('page-btn');
        if (i === currentPage) btn.classList.add('active');
        btn.innerText = i;
        btn.onclick = () => { currentPage = i; renderizarTablaRepro(lista); };
        paginationContainer.appendChild(btn);
    }

    // Botón Siguiente »
    const btnNext = document.createElement('button');
    btnNext.classList.add('page-btn');
    btnNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
    btnNext.disabled = currentPage === totalPages;
    btnNext.onclick = () => { currentPage++; renderizarTablaRepro(lista); };
    paginationContainer.appendChild(btnNext);
}

/**
 * Llena el modal con los datos del registro reproductivo
 */
function prepararEdicion(id) {
    const reg = reproData.find(r => r.id === id);
    if (!reg) return;

    // Función auxiliar para obtener solo YYYY-MM-DD
    const getFecha = (fechaStr) => fechaStr ? fechaStr.split('T')[0] : '';

    document.getElementById('editReproId').value = reg.id;
    document.getElementById('editIdVaca').value = reg.idVaca;
    document.getElementById('editNombreVaca').value = reg.nombreVaca || '';
    document.getElementById('editFechaCelo').value = getFecha(reg.fechaCelo);
    document.getElementById('editFechaInseminacion').value = getFecha(reg.fechaInseminacion);
    document.getElementById('editToroSemen').value = reg.toroSemen || '';
    document.getElementById('editFechaParto').value = getFecha(reg.fechaParto);

    document.getElementById('editReproModal').style.display = 'flex';
}

/**
 * Calcula la fecha de parto prevista: Inseminación + 9 meses + 10 días
 */
function calcularFechaParto(fechaInseminacion) {
    const fecha = new Date(fechaInseminacion + 'T00:00:00');
    fecha.setMonth(fecha.getMonth() + 9);
    fecha.setDate(fecha.getDate() + 10);
    // Formatear a YYYY-MM-DD para el input date
    return fecha.toISOString().split('T')[0];
}

// Recalcular fecha de parto automáticamente al cambiar la inseminación en el modal
document.addEventListener('DOMContentLoaded', function() {
    const editFechaInseminacion = document.getElementById('editFechaInseminacion');
    if (editFechaInseminacion) {
        editFechaInseminacion.addEventListener('change', function() {
            const editFechaParto = document.getElementById('editFechaParto');
            if (this.value && editFechaParto) {
                editFechaParto.value = calcularFechaParto(this.value);
            }
        });
    }
});



/**
 * Configura el buscador para filtrar por ID Vaca o Nombre
 */
function configurarBuscadorRepro() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            const filtrados = reproData.filter(reg => 
                reg.idVaca.toLowerCase().includes(term) || 
                (reg.nombreVaca && reg.nombreVaca.toLowerCase().includes(term))
            );
            currentPage = 1;
            renderizarTablaRepro(filtrados);
        });
    }
}

/**
 * Maneja la eliminación y cierre de modales
 */
function abrirModalEliminar(id) {
    idParaEliminar = id;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.style.display = 'flex';
}

function configurarBotonesModal() {
    // Botón cerrar modal de edición
    const closeEdit = document.getElementById('closeEditRepro');
    if (closeEdit) {
        closeEdit.addEventListener('click', () => {
            document.getElementById('editReproModal').style.display = 'none';
        });
    }

    // Botones del modal de eliminación
    const btnCancelar = document.getElementById('cancelDelete');
    const btnConfirmar = document.getElementById('confirmDelete');

    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            document.getElementById('deleteConfirmModal').style.display = 'none';
        });
    }

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', async () => {
            if (idParaEliminar) {
                try {
                    const response = await fetch(`/reproduccion/api/eliminar/${idParaEliminar}`, { method: 'DELETE' });
                    if (response.ok) {
                        document.getElementById('deleteConfirmModal').style.display = 'none';
                        mostrarToast('Eliminado', 'Registro reproductivo eliminado.', true);
                        cargarRegistrosRepro();
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });
    }
}


/**
 * Toast genérico
 */
function mostrarToast(titulo, mensaje, esError = false) {
    const toast = document.getElementById('toastNotification');
    const icon = document.getElementById('toastIcon');
    const title = document.getElementById('toastTitle');
    const text = document.getElementById('toastText');

    title.innerText = titulo;
    text.innerText = mensaje;
    
    if (esError) {
        toast.classList.add('error'); 
        icon.className = 'fas fa-exclamation-circle';
    } else {
        toast.classList.remove('error');
        icon.className = 'fas fa-check-circle';
    }

    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 4000);
}
