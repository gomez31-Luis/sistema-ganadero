/**
 * ARCHIVO: usuarios_lista.js
 * PROPÓSITO: Carga la lista de usuarios, permite búsqueda,
 * paginación y eliminación de usuarios (administradores).
 */

let usuariosData = [];
let currentPage = 1;
const recordsPerPage = 4;
let deleteId = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();

    const searchInput = document.getElementById('searchUsuario');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentPage = 1;
            renderTable(this.value.trim());
        });
    }

    // Modal Eliminar
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const deleteModal = document.getElementById('deleteConfirmModal');

    if (cancelDeleteBtn && confirmDeleteBtn && deleteModal) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.classList.remove('active');
            deleteId = null;
        });

        confirmDeleteBtn.addEventListener('click', async () => {
            if (deleteId) {
                try {
                    const response = await fetch(`/api/usuarios/eliminar/${deleteId}`, {
                        method: 'POST'
                    });
                    if (response.ok) {
                        mostrarToast('Usuario eliminado', 'success');
                        deleteModal.classList.remove('active');
                        cargarUsuarios(); // Recargar datos
                    } else {
                        mostrarToast('Error al eliminar', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    mostrarToast('Error de conexión', 'error');
                }
            }
        });
    }
});

async function cargarUsuarios() {
    try {
        const response = await fetch('/api/usuarios/todos');
        if (!response.ok) throw new Error('Error al cargar usuarios');
        
        usuariosData = await response.json();
        renderTable();
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error al cargar la lista', 'error');
    }
}

function renderTable(searchTerm = "") {
    const tbody = document.getElementById('usuarioTableBody');
    if (!tbody) return;

    let filtrados = usuariosData;
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtrados = usuariosData.filter(u => 
            (u.username && u.username.toLowerCase().includes(term)) ||
            (u.nombreCompleto && u.nombreCompleto.toLowerCase().includes(term)) ||
            (u.email && u.email.toLowerCase().includes(term))
        );
    }

    const totalPages = Math.ceil(filtrados.length / recordsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * recordsPerPage;
    const paginatedItems = filtrados.slice(start, start + recordsPerPage);

    tbody.innerHTML = '';

    if (paginatedItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px;">No se encontraron usuarios.</td></tr>`;
        renderPagination(totalPages);
        return;
    }

    paginatedItems.forEach(u => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:40px; height:40px; border-radius:50%; background:var(--primary-light); color:white; display:flex; align-items:center; justify-content:center; font-weight:bold;">
                        ${(u.nombreCompleto || u.username || '?').charAt(0).toUpperCase()}
                    </div>
                    <strong>${u.nombreCompleto || 'Sin nombre'}</strong>
                </div>
            </td>
            <td>@${u.username || 'N/A'}</td>
            <td>${u.email || 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-delete" onclick="confirmarEliminar('${u.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const container = document.getElementById('pagination-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (totalPages <= 1) return;

    // Prev Button
    const prevBtn = document.createElement('button');
    prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(document.getElementById('searchUsuario')?.value.trim() || '');
        }
    };
    container.appendChild(prevBtn);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
        pageBtn.innerText = i;
        pageBtn.onclick = () => {
            currentPage = i;
            renderTable(document.getElementById('searchUsuario')?.value.trim() || '');
        };
        container.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = `page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable(document.getElementById('searchUsuario')?.value.trim() || '');
        }
    };
    container.appendChild(nextBtn);
}

window.confirmarEliminar = function(id) {
    deleteId = id;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.classList.add('active');
};

function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastText = document.getElementById('toastText');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast || !toastTitle || !toastText || !toastIcon) return;

    toastText.textContent = mensaje;
    
    toastIcon.className = '';
    
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
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}
