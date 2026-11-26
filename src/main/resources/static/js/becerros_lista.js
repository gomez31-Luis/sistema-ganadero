/**
 * ARCHIVO: becerros_lista.js
 * PROPÓSITO: Maneja la lógica de la vista 'ver-becerros.html'.
 * Se encarga de cargar la lista de partos, filtrar únicamente los que tienen becerros registrados,
 * renderizar la tabla, aplicar la paginación, la búsqueda y actualizar el estado (vivo, vendido, etc.) del becerro.
 */
let becerrosData = [];
let currentPage = 1;
const itemsPerPage = 4;

document.addEventListener('DOMContentLoaded', () => {
    cargarBecerros();

    const searchInput = document.getElementById('searchBecerro');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtrados = becerrosData.filter(reg => 
                (reg.idBecerro && reg.idBecerro.toLowerCase().includes(term)) ||
                (reg.nombreBecerro && reg.nombreBecerro.toLowerCase().includes(term)) ||
                (reg.idVaca && reg.idVaca.toLowerCase().includes(term))
            );
            currentPage = 1;
            renderizarTablaBecerros(filtrados);
        });
    }

    // Modal cerrar
    const closeBtn = document.getElementById('closeEditBecerro');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('editBecerroModal').style.display = 'none';
        });
    }

    // Formulario de edición
    const formEdit = document.getElementById('formEditBecerro');
    if (formEdit) {
        formEdit.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('editBecerroId').value;
            const estado = document.getElementById('editEstadoBecerro').value;
            
            await actualizarEstadoBecerro(id, estado);
        });
    }
});

async function cargarBecerros() {
    try {
        const response = await fetch('/partos/api/listar');
        const data = await response.json();
        
        // Filtrar solo los registros que tienen becerro registrado
        becerrosData = data.filter(r => r.idBecerro || r.nombreBecerro);
        
        // Ordenar por fecha de parto (nacimiento) descendente
        becerrosData.sort((a, b) => new Date(b.fechaParto) - new Date(a.fechaParto));
        
        renderizarTablaBecerros(becerrosData);
    } catch (error) {
        console.error('Error al cargar becerros:', error);
        mostrarToast('Error', 'No se pudo cargar la lista de becerros', true);
    }
}

function renderizarTablaBecerros(lista) {
    const tbody = document.getElementById('becerrosTableBody');
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
        
        const fNac = formatearFechaLocal(reg.fechaParto);
        const estado = reg.estadoBecerro || 'activo';
        
        // Colores para el badge de estado
        let estadoClase = 'status-activa';
        if (estado === 'vendido') estadoClase = 'status-vendida';
        if (estado === 'fallecido') estadoClase = 'status-fallecido'; // Necesitaremos agregar esto en css o reusar uno
        
        row.innerHTML = `
            <td><strong>${reg.idBecerro || 'S/N'}</strong></td>
            <td>${reg.nombreBecerro || 'N/A'}</td>
            <td><span class="badge ${reg.sexoCria === 'Macho' ? 'badge-male' : (reg.sexoCria === 'Hembra' ? 'badge-female' : '')}">${reg.sexoCria || 'N/A'}</span></td>
            <td>${fNac}</td>
            <td>${reg.idVaca}</td>
            <td><span class="status ${estadoClase}">${estado}</span></td>
            <td class="actions">
                <button class="btn-icon" title="Cambiar Estado" onclick="abrirModalEstado('${reg.id}', '${estado}')"><i class="fas fa-sync-alt"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    renderizarPaginacionBecerros(lista);
}

function renderizarPaginacionBecerros(lista) {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(lista.length / itemsPerPage);
    if (totalPages <= 1) return;

    const btnPrev = document.createElement('button');
    btnPrev.className = 'page-btn';
    btnPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
    btnPrev.disabled = currentPage === 1;
    btnPrev.onclick = () => { currentPage--; renderizarTablaBecerros(lista); };
    paginationContainer.appendChild(btnPrev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
        btn.innerText = i;
        btn.onclick = () => {
            currentPage = i;
            renderizarTablaBecerros(lista);
        };
        paginationContainer.appendChild(btn);
    }

    const btnNext = document.createElement('button');
    btnNext.className = 'page-btn';
    btnNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
    btnNext.disabled = currentPage === totalPages;
    btnNext.onclick = () => { currentPage++; renderizarTablaBecerros(lista); };
    paginationContainer.appendChild(btnNext);
}

function abrirModalEstado(id, estadoActual) {
    document.getElementById('editBecerroId').value = id;
    document.getElementById('editEstadoBecerro').value = estadoActual;
    document.getElementById('editBecerroModal').style.display = 'flex';
}

async function actualizarEstadoBecerro(id, nuevoEstado) {
    // Primero, encontramos el registro original completo
    const reg = becerrosData.find(r => r.id === id);
    if (!reg) return;

    // Actualizamos el estado en el objeto
    reg.estadoBecerro = nuevoEstado;

    try {
        // Como no tenemos una ruta específica para actualizar SOLO el estado,
        // enviaremos todo el objeto al endpoint /partos/guardar como x-www-form-urlencoded
        const formData = new URLSearchParams();
        for (const key in reg) {
            if (reg[key] !== null && reg[key] !== undefined) {
                // Formatear fechas correctamente si es necesario
                let value = reg[key];
                if (key === 'fechaParto' || key === 'fechaCelo' || key === 'fechaInseminacion') {
                    value = value.split('T')[0];
                }
                formData.append(key, value);
            }
        }

        const response = await fetch('/partos/guardar', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        if (response.ok) {
            document.getElementById('editBecerroModal').style.display = 'none';
            mostrarToast('¡Actualizado!', 'El estado del becerro se actualizó correctamente.');
            cargarBecerros(); // Recargar la tabla
        } else {
            throw new Error("Error al guardar");
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error', 'Hubo un problema al actualizar el estado.', true);
    }
}

function mostrarToast(titulo, mensaje, esError = false) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;

    const icon = document.getElementById('toastIcon');
    const title = document.getElementById('toastTitle');
    const text = document.getElementById('toastText');

    if (title) title.innerText = titulo;
    if (text) text.innerText = mensaje;
    
    if (esError) {
        toast.classList.add('error'); 
        if (icon) icon.className = 'fas fa-exclamation-circle';
    } else {
        toast.classList.remove('error');
        if (icon) icon.className = 'fas fa-check-circle';
    }

    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 4000);
}
