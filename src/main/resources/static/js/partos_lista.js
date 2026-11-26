/**
 * ARCHIVO: partos_lista.js
 * PROPÓSITO: Gestiona la vista de 'ver-partos.html'.
 * Se encarga de descargar la información de nacimientos, mostrar la tabla,
 * habilitar la búsqueda, paginación y las opciones para editar o eliminar partos.
 */
let partoData = [];
let idParaEliminar = null;
let currentPage = 1;
const itemsPerPage = 4;

document.addEventListener('DOMContentLoaded', function() {
    cargarRegistrosPartos();
    configurarBuscadorParto();
    configurarBotonesModalParto();
});

async function cargarRegistrosPartos() {
    try {
        const response = await fetch('/partos/api/listar');
        partoData = await response.json();
        currentPage = 1;
        renderizarTablaParto(partoData);
    } catch (error) {
        console.error('Error al cargar historial de partos:', error);
    }
}

function renderizarTablaParto(lista) {
    const tbody = document.getElementById('partoTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = ''; 

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsPaginados = lista.slice(startIndex, endIndex);

    const formatearFechaLocal = (fechaStr) => {
        if (!fechaStr) return 'N/A';
        const [year, month, day] = fechaStr.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    itemsPaginados.forEach(reg => {
        const row = document.createElement('tr');
        
        const fParto = formatearFechaLocal(reg.fechaParto);
        
        row.innerHTML = `
            <td><strong>${reg.idVaca}</strong></td>
            <td>${reg.nombreVaca || 'N/A'}</td>
            <td><span class="date-badge">${fParto}</span></td>
            <td>${reg.idBecerro || 'N/A'}</td>
            <td>${reg.nombreBecerro || 'N/A'}</td>
            <td>${reg.sexoCria || 'N/A'}</td>
            <td>${reg.observaciones || ''}</td>
            <td class="actions">
                <button class="btn-icon" title="Editar" onclick="prepararEdicionParto('${reg.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" title="Eliminar" onclick="abrirModalEliminarParto('${reg.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    renderizarPaginacionPartos(lista);
}

function renderizarPaginacionPartos(lista) {
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
    btnPrev.onclick = () => { currentPage--; renderizarTablaParto(lista); };
    paginationContainer.appendChild(btnPrev);

    // Botones numéricos
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.classList.add('page-btn');
        if (i === currentPage) btn.classList.add('active');
        btn.innerText = i;
        btn.onclick = () => { currentPage = i; renderizarTablaParto(lista); };
        paginationContainer.appendChild(btn);
    }

    // Botón Siguiente »
    const btnNext = document.createElement('button');
    btnNext.classList.add('page-btn');
    btnNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
    btnNext.disabled = currentPage === totalPages;
    btnNext.onclick = () => { currentPage++; renderizarTablaParto(lista); };
    paginationContainer.appendChild(btnNext);
}

function configurarBuscadorParto() {
    const searchInput = document.getElementById('searchParto');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            const filtrados = partoData.filter(reg => 
                reg.idVaca.toLowerCase().includes(term) || 
                (reg.nombreVaca && reg.nombreVaca.toLowerCase().includes(term)) ||
                (reg.idBecerro && reg.idBecerro.toLowerCase().includes(term))
            );
            currentPage = 1;
            renderizarTablaParto(filtrados);
        });
    }
}

function prepararEdicionParto(id) {
    const reg = partoData.find(r => r.id === id);
    if (!reg) return;

    const getFecha = (fechaStr) => fechaStr ? fechaStr.split('T')[0] : '';

    document.getElementById('editPartoId').value = reg.id;
    document.getElementById('editIdVaca').value = reg.idVaca;
    document.getElementById('editNombreVaca').value = reg.nombreVaca || '';
    document.getElementById('editFechaParto').value = getFecha(reg.fechaParto);
    document.getElementById('editSexoCria').value = reg.sexoCria || 'Hembra';
    document.getElementById('editIdBecerro').value = reg.idBecerro || '';
    document.getElementById('editNombreBecerro').value = reg.nombreBecerro || '';
    document.getElementById('editObservaciones').value = reg.observaciones || '';

    document.getElementById('editPartoModal').style.display = 'flex';
}

function abrirModalEliminarParto(id) {
    idParaEliminar = id;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.style.display = 'flex';
}

function configurarBotonesModalParto() {
    const closeEdit = document.getElementById('closeEditParto');
    if (closeEdit) {
        closeEdit.addEventListener('click', () => {
            document.getElementById('editPartoModal').style.display = 'none';
        });
    }

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
                    const response = await fetch(`/partos/api/eliminar/${idParaEliminar}`, { method: 'DELETE' });
                    if (response.ok) {
                        document.getElementById('deleteConfirmModal').style.display = 'none';
                        mostrarToastParto('Eliminado', 'Registro de parto eliminado.', true);
                        cargarRegistrosPartos();
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });
    }
}

function mostrarToastParto(titulo, mensaje, esError = false) {
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
