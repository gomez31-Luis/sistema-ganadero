/**
 * ARCHIVO: toros_lista.js
 * PROPÓSITO: Maneja la lógica de la vista 'ver-toros.html'.
 * Se encarga de obtener la lista de toros de compra desde el servidor, renderizarla en la tabla,
 * aplicar la búsqueda, la paginación y procesar la eliminación y edición de los registros de toros.
 */
let allToros = [];
let toroIdToDelete = null;

let currentPage = 1;
const itemsPerPage = 4;

document.addEventListener('DOMContentLoaded', () => {
    fetchToros();
    
    // Búsqueda
    const searchInput = document.getElementById('searchToro');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtrados = allToros.filter(toro => 
                (toro.idToro && toro.idToro.toLowerCase().includes(term))
            );
            currentPage = 1;
            renderToros(filtrados);
        });
    }

    // Cerrar modal de edición
    const closeEditBtn = document.getElementById('closeEditToro');
    if (closeEditBtn) {
        closeEditBtn.onclick = () => document.getElementById('editToroModal').classList.remove('active');
    }

    // Cancelar eliminación
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.onclick = () => document.getElementById('deleteConfirmModal').classList.remove('active');
    }

    // Confirmar eliminación
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.onclick = () => {
            if (toroIdToDelete) {
                eliminarToro(toroIdToDelete);
            }
        };
    }

    // Mostrar notificación si viene de redirección
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('exito')) {
        showToast('¡Éxito!', 'Los datos se guardaron correctamente.');
        window.history.replaceState({}, document.title, "/ver-toros.html");
    }
});

function fetchToros() {
    fetch('/toros/todos')
        .then(response => response.json())
        .then(data => {
            allToros = data;
            currentPage = 1;
            renderToros(allToros);
        })
        .catch(error => {
            console.error('Error fetching toros:', error);
            const tableBody = document.getElementById('toroTableBody');
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:red;">Error al cargar los datos</td></tr>';
        });
}

function renderToros(toros) {
    const tableBody = document.getElementById('toroTableBody');
    tableBody.innerHTML = '';

    if (toros.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No hay registros de toros comprados</td></tr>';
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsPaginados = toros.slice(startIndex, endIndex);

    itemsPaginados.forEach(toro => {
        const row = document.createElement('tr');
        const estado = toro.estado || 'Activo';
        const estadoClass = estado.toLowerCase() === 'activo' ? 'status-active' : 'status-sold';
        const precio = toro.precio ? `$${toro.precio.toLocaleString()}` : '-';
        const peso = toro.pesoKg ? `${toro.pesoKg} Kg` : '-';
        
        row.innerHTML = `
            <td style="font-weight: bold;">${toro.idToro || '-'}</td>
            <td>${peso}</td>
            <td>${precio}</td>
            <td>${toro.kgGanados || '0'} Kg</td>
            <td><span class="date-badge">${toro.fechaCompra || '-'}</span></td>
            <td>${toro.fechaSalida || '-'}</td>
            <td><span class="status ${estadoClass}">${estado}</span></td>
            <td class="actions">
                <button class="btn-icon" onclick="abrirEditar('${toro.id}')" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" onclick="abrirEliminar('${toro.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    renderPaginacionToros(toros);
}

function renderPaginacionToros(lista) {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(lista.length / itemsPerPage);
    
    if (totalPages <= 1) return;

    // Botón Anterior
    const btnPrev = document.createElement('button');
    btnPrev.classList.add('page-btn');
    btnPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
    btnPrev.disabled = currentPage === 1;
    btnPrev.onclick = () => { currentPage--; renderToros(lista); };
    paginationContainer.appendChild(btnPrev);

    // Botones numéricos
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.classList.add('page-btn');
        if (i === currentPage) btn.classList.add('active');
        btn.innerText = i;
        btn.onclick = () => { currentPage = i; renderToros(lista); };
        paginationContainer.appendChild(btn);
    }

    // Botón Siguiente
    const btnNext = document.createElement('button');
    btnNext.classList.add('page-btn');
    btnNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
    btnNext.disabled = currentPage === totalPages;
    btnNext.onclick = () => { currentPage++; renderToros(lista); };
    paginationContainer.appendChild(btnNext);
}

function abrirEditar(id) {
    const toro = allToros.find(t => t.id === id);
    if (!toro) return;

    document.getElementById('editId').value = toro.id;
    document.getElementById('editIdToro').value = toro.idToro || '';
    document.getElementById('editFechaCompra').value = toro.fechaCompra || '';
    document.getElementById('editPesoKg').value = toro.pesoKg || '';
    document.getElementById('editPrecio').value = toro.precio || '';
    document.getElementById('editKgGanados').value = toro.kgGanados || '';
    document.getElementById('editFechaSalida').value = toro.fechaSalida || '';
    document.getElementById('editEstado').value = toro.estado || 'Activo';

    document.getElementById('editToroModal').classList.add('active');
}

function abrirEliminar(id) {
    toroIdToDelete = id;
    document.getElementById('deleteConfirmModal').classList.add('active');
}

function eliminarToro(id) {
    fetch(`/toros/api/eliminar/${id}`, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                document.getElementById('deleteConfirmModal').classList.remove('active');
                showToast('¡Eliminado!', 'El registro ha sido eliminado.');
                fetchToros();
            } else {
                alert('Error al eliminar el registro (Status: ' + response.status + ')');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error de red al intentar eliminar');
        });
}

function showToast(title, text) {
    const toast = document.getElementById('toastNotification');
    if (toast) {
        document.getElementById('toastTitle').innerText = title;
        document.getElementById('toastText').innerText = text;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 5000);
    }
}
