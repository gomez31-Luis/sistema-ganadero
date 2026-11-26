/**
 * ARCHIVO: animales.js
 * PROPÓSITO: Archivo principal para la gestión del inventario de ganado en 'ver-individual.html'.
 * Administra la carga dinámica de animales, renderizado de la tabla con paginación,
 * búsqueda interactiva, visualización de fotos, modales de edición/eliminación 
 * y la carga del historial de crías asociado a cada vaca.
 */
let animalesData = [];
let currentPage = 1;
const itemsPerPage = 4; 

// Variables para paginación de crías
let currentCriasData = [];
let currentCriasPage = 1;
const criasPerPage = 4;

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('animalTableBody')) {
        cargarAnimales();
        configurarBuscador();
    }
});

async function cargarAnimales() {
    try {
        const response = await fetch('/animales/api/listar');
        animalesData = await response.json();
        currentPage = 1;
        renderizarTabla(animalesData);
    } catch (error) {
        console.error('Error al cargar animales:', error);
    }
}

function renderizarTabla(lista) {
    const tbody = document.getElementById('animalTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = ''; 

    // Lógica de paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsPaginados = lista.slice(startIndex, endIndex);

    // Función auxiliar para evitar problemas de zona horaria al mostrar fechas
    const formatearFechaLocal = (fechaStr) => {
        if (!fechaStr) return 'N/A';
        const [year, month, day] = fechaStr.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    itemsPaginados.forEach(animal => {
        const row = document.createElement('tr');
        const fecha = formatearFechaLocal(animal.nacimiento);
        
        const fotoHtml = animal.fotoUrl 
            ? `<img src="${animal.fotoUrl}" alt="${animal.nombre}" onclick="verFotoEnGrande('${animal.fotoUrl}')" style="width:50px; height:50px; object-fit:cover; border-radius:8px; border:2px solid #e0e0e0; cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">` 
            : `<div style="width:50px; height:50px; border-radius:8px; background:#f0f2f5; display:flex; align-items:center; justify-content:center; color:#aaa;"><i class="fas fa-camera"></i></div>`;
        
        row.innerHTML = `
            <td>${fotoHtml}</td>
            <td><strong>${animal.carabana}</strong></td>
            <td>${animal.nombre || 'N/A'}</td>
            <td>${animal.raza || 'N/A'}</td>
            <td>${fecha}</td>
            <td><span class="badge ${animal.sexo === 'macho' ? 'badge-male' : 'badge-female'}">${animal.sexo}</span></td>
            <td><span class="status status-${animal.estado}">${animal.estado}</span></td>
            <td class="actions">
                ${animal.sexo === 'hembra' ? `<button class="btn-icon" style="color:#8e44ad;" title="Ver Crías" onclick="verCrias('${animal.carabana}', '${animal.nombre}')"><i class="fas fa-baby-carriage"></i></button>` : ''}
                <button class="btn-icon" title="Editar" onclick="prepararEdicion('${animal.carabana}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" title="Eliminar" onclick="confirmarEliminacion('${animal.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    renderizarPaginacion(lista);
}

function renderizarPaginacion(lista) {
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
    btnPrev.onclick = () => { currentPage--; renderizarTabla(lista); };
    paginationContainer.appendChild(btnPrev);

    // Botones numéricos
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.classList.add('page-btn');
        if (i === currentPage) btn.classList.add('active');
        btn.innerText = i;
        btn.onclick = () => { currentPage = i; renderizarTabla(lista); };
        paginationContainer.appendChild(btn);
    }

    // Botón Siguiente »
    const btnNext = document.createElement('button');
    btnNext.classList.add('page-btn');
    btnNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
    btnNext.disabled = currentPage === totalPages;
    btnNext.onclick = () => { currentPage++; renderizarTabla(lista); };
    paginationContainer.appendChild(btnNext);
}

function configurarBuscador() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            const filtrados = animalesData.filter(animal => 
                animal.carabana.toLowerCase().includes(term) || 
                (animal.nombre && animal.nombre.toLowerCase().includes(term))
            );
            currentPage = 1; // Volver a la página 1 al buscar
            renderizarTabla(filtrados);
        });
    }
}

let idParaEliminar = null;

/**
 * Muestra el modal de confirmación en lugar de usar confirm() del navegador
 */
function confirmarEliminacion(id) {
    idParaEliminar = id;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.style.display = 'flex';
}

// Configurar botones del modal de eliminación
document.addEventListener('DOMContentLoaded', function() {
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
                    const response = await fetch(`/animales/api/eliminar/${idParaEliminar}`, { method: 'DELETE' });
                    if (response.ok) {
                        document.getElementById('deleteConfirmModal').style.display = 'none';
                        mostrarToast('Eliminado', 'El animal ha sido removido del sistema.', true);
                        cargarAnimales();
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });
    }
});


/**
 * Llena el modal con los datos del animal para editar
 */
function prepararEdicion(carabana) {
    const animal = animalesData.find(a => a.carabana === carabana);
    if (!animal) return;

    const getFecha = (fechaStr) => fechaStr ? fechaStr.split('T')[0] : '';

    document.getElementById('editId').value = animal.id;
    document.getElementById('editCarabana').value = animal.carabana;
    document.getElementById('editNombre').value = animal.nombre || '';
    document.getElementById('editRaza').value = animal.raza || '';
    document.getElementById('editNacimiento').value = getFecha(animal.nacimiento);
    document.getElementById('editSexo').value = animal.sexo;
    document.getElementById('editEstado').value = animal.estado;

    // Mostrar foto actual en el modal
    const photoPreview = document.getElementById('editPhotoPreview');
    if (photoPreview) {
        if (animal.fotoUrl) {
            photoPreview.innerHTML = `<img src="${animal.fotoUrl}" style="width:100%; height:100%; object-fit:cover;">`;
        } else {
            photoPreview.innerHTML = '<i class="fas fa-camera" style="color:#ccc; font-size:24px;"></i>';
        }
    }
    // Limpiar input file
    const fileInput = document.getElementById('editAnimalPhoto');
    if (fileInput) fileInput.value = '';

    document.getElementById('editModal').style.display = 'flex';
}

// Previsualizar la nueva foto seleccionada en el modal de edición
document.addEventListener('DOMContentLoaded', function() {
    const editPhotoInput = document.getElementById('editAnimalPhoto');
    const editPhotoPreview = document.getElementById('editPhotoPreview');
    if (editPhotoInput && editPhotoPreview) {
        editPhotoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    editPhotoPreview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
                }
                reader.readAsDataURL(file);
            }
        });
    }
});

/**
 * Muestra notificaciones Toast profesionales
 */
function mostrarToast(titulo, mensaje, esError = false) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;

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

// Cerrar modal de edición
const closeEdit = document.getElementById('closeEdit');
if (closeEdit) {
    closeEdit.addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
    });
}

/**
 * Muestra la foto en tamaño grande en un modal
 */
function verFotoEnGrande(url) {
    const modal = document.getElementById('imageModal');
    const fullSizeImage = document.getElementById('fullSizeImage');
    if (modal && fullSizeImage) {
        fullSizeImage.src = url;
        modal.style.display = 'flex';
    }
}

// Configurar el cierre del modal de la imagen
document.addEventListener('DOMContentLoaded', function() {
    const closeImageModal = document.getElementById('closeImageModal');
    const imageModal = document.getElementById('imageModal');
    
    if (closeImageModal) {
        closeImageModal.addEventListener('click', () => {
            imageModal.style.display = 'none';
        });
    }
    
    // Cerrar si hace clic fuera de la imagen
    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.style.display = 'none';
            }
        });
    }
});

/**
 * Muestra el historial de crías de una vaca
 */
async function verCrias(idVaca, nombreVaca) {
    const modal = document.getElementById('criasModal');
    const subtitle = document.getElementById('criasModalSubtitle');
    const tbody = document.getElementById('criasTableBody');
    const paginationContainer = document.getElementById('crias-pagination-container');
    
    // Configurar encabezado
    const nombreStr = nombreVaca && nombreVaca !== 'null' ? ` (${nombreVaca})` : '';
    subtitle.innerHTML = `Crías registradas para la vaca <strong>${idVaca}</strong>${nombreStr}`;
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Buscando crías...</td></tr>';
    if (paginationContainer) paginationContainer.innerHTML = '';
    
    // Mostrar modal
    modal.style.display = 'flex';

    try {
        const response = await fetch(`/partos/api/madre/${idVaca}`);
        currentCriasData = await response.json();
        currentCriasPage = 1;
        
        renderizarTablaCrias();
        
    } catch (error) {
        console.error('Error al obtener crías:', error);
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#e74c3c;">Error al cargar el historial.</td></tr>';
    }
}

function renderizarTablaCrias() {
    const tbody = document.getElementById('criasTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (currentCriasData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#666;">No hay partos registrados para este animal.</td></tr>';
        return;
    }

    // Lógica de paginación
    const startIndex = (currentCriasPage - 1) * criasPerPage;
    const endIndex = startIndex + criasPerPage;
    const itemsPaginados = currentCriasData.slice(startIndex, endIndex);

    // Función para formato seguro de fecha
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'N/A';
        const [year, month, day] = fechaStr.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    itemsPaginados.forEach(parto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${formatearFecha(parto.fechaParto)}</strong></td>
            <td>${parto.idBecerro || 'N/A'}</td>
            <td>${parto.nombreBecerro || 'N/A'}</td>
            <td><span class="badge ${parto.sexoCria === 'Macho' ? 'badge-male' : (parto.sexoCria === 'Hembra' ? 'badge-female' : '')}">${parto.sexoCria || 'N/A'}</span></td>
        `;
        tbody.appendChild(row);
    });

    renderizarPaginacionCrias();
}

function renderizarPaginacionCrias() {
    const paginationContainer = document.getElementById('crias-pagination-container');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(currentCriasData.length / criasPerPage);
    
    if (totalPages <= 1) return;

    // Botón Anterior
    const btnPrev = document.createElement('button');
    btnPrev.classList.add('page-btn');
    btnPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
    btnPrev.disabled = currentCriasPage === 1;
    btnPrev.onclick = () => { currentCriasPage--; renderizarTablaCrias(); };
    paginationContainer.appendChild(btnPrev);

    // Botones numéricos
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.classList.add('page-btn');
        if (i === currentCriasPage) btn.classList.add('active');
        btn.innerText = i;
        btn.onclick = () => { currentCriasPage = i; renderizarTablaCrias(); };
        paginationContainer.appendChild(btn);
    }

    // Botón Siguiente
    const btnNext = document.createElement('button');
    btnNext.classList.add('page-btn');
    btnNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
    btnNext.disabled = currentCriasPage === totalPages;
    btnNext.onclick = () => { currentCriasPage++; renderizarTablaCrias(); };
    paginationContainer.appendChild(btnNext);
}

// Configurar cierre del modal de crías
document.addEventListener('DOMContentLoaded', function() {
    const closeCriasModal = document.getElementById('closeCriasModal');
    if (closeCriasModal) {
        closeCriasModal.addEventListener('click', () => {
            document.getElementById('criasModal').style.display = 'none';
        });
    }
});
