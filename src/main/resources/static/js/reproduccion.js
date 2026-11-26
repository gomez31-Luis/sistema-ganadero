let animalesHato = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarAnimalesParaBusqueda();
    configurarSelectorAnimal();
});

/**
 * Carga todos los animales del inventario para tenerlos disponibles
 */
async function cargarAnimalesParaBusqueda() {
    try {
        const response = await fetch('/animales/api/listar');
        animalesHato = await response.json();
    } catch (error) {
        console.error('Error al cargar animales:', error);
    }
}

/**
 * Configura el buscador de autocompletado
 */
function configurarSelectorAnimal() {
    const inputId = document.getElementById('idVaca');
    const inputNombre = document.getElementById('nombreVaca');
    
    // Crear el contenedor de resultados dinámicamente
    const resultsList = document.createElement('ul');
    resultsList.className = 'search-results-list';
    // Se adjunta al form-group para que flote correctamente
    inputId.closest('.form-group').appendChild(resultsList);


    inputId.addEventListener('input', function() {
        const term = this.value.toLowerCase();
        resultsList.innerHTML = '';
        
        if (term.length < 1) {
            resultsList.style.display = 'none';
            return;
        }

        const filtrados = animalesHato.filter(a => 
            a.carabana.toLowerCase().includes(term) || 
            (a.nombre && a.nombre.toLowerCase().includes(term))
        );

        if (filtrados.length > 0) {
            filtrados.forEach(animal => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="animal-id">${animal.carabana}</span>
                    <span class="animal-name">${animal.nombre || ''}</span>
                `;
                li.onclick = function() {
                    inputId.value = animal.carabana;
                    inputNombre.value = animal.nombre || '';
                    resultsList.style.display = 'none';
                };
                resultsList.appendChild(li);
            });
            resultsList.style.display = 'block';
        } else {
            resultsList.style.display = 'none';
        }
    });

    // Cerrar lista al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (e.target !== inputId) {
            resultsList.style.display = 'none';
        }
    });

    // --- NUEVO: Cálculo automático de fecha de parto ---
    const inputInseminacion = document.getElementById('fechaInseminacion');
    const inputParto = document.getElementById('fechaParto');

    if (inputInseminacion && inputParto) {
        inputInseminacion.addEventListener('change', function() {
            if (this.value) {
                // Agregar T00:00:00 asegura que trabajemos en hora local sin desfases
                const fechaIns = new Date(this.value + 'T00:00:00');
                
                // Sumar 9 meses y 10 días
                fechaIns.setMonth(fechaIns.getMonth() + 9);
                fechaIns.setDate(fechaIns.getDate() + 10);
                
                // Formatear de vuelta a YYYY-MM-DD
                const yyyy = fechaIns.getFullYear();
                const mm = String(fechaIns.getMonth() + 1).padStart(2, '0');
                const dd = String(fechaIns.getDate()).padStart(2, '0'); 
                
                inputParto.value = `${yyyy}-${mm}-${dd}`;
            }
        });
    }
}

