// Función para obtener el parámetro 'id' desde la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Obtén el imdbID de la película desde la URL
const imdbID = getQueryParam('id');

// Si hay un imdbID, llamamos a BuscarPelicula
if (imdbID) {
    BuscarPelicula(imdbID);
}

//******************************************************************************************** */
// Función para truncar texto
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Función para cargar y mostrar las películas
function loadMovies() {
    fetch('https://movie.azurewebsites.net/api/cartelera?title=&ubication=')
        .then(response => response.json())
        .then(data => {
            const movieCardsContainer = document.getElementById('movieCards');
            movieCardsContainer.innerHTML = ''; // Limpia el contenedor antes de añadir las nuevas cards

            data.forEach(pelicula => {
                const card = `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <img src="${pelicula.Poster}" class="card-img-top" alt="${pelicula.Title}">
                            <div class="card-body">
                                <h5 class="card-title">${pelicula.Title}</h5>
                                <p class="card-text">${truncateText(pelicula.description, 100)}</p> <!-- Trunca la descripción -->
                                <a href="form.html?id=${pelicula.imdbID}" class="btn btn-primary">Editar</a>
                            </div>
                        </div>
                    </div>
                `;
                movieCardsContainer.innerHTML += card;
            });
        })
        .catch(error => {
            console.error('Error al obtener las películas:', error);
        });
}

// Llama a la función cuando el documento esté listo
document.addEventListener('DOMContentLoaded', loadMovies);

//<a href="editar.html?id=${pelicula.imdbID}" class="btn btn-primary">Editar</a>
//******************************************************************************************** */

function GuardarPelicula() {
    //alert("Pelicula Guardada");
    const movie = {
        imdbID: document.getElementById('imdbID').value,
        Title: document.getElementById('title').value,
        Year: document.getElementById('year').value,
        Type: document.getElementById('type').value,
        Poster: document.getElementById('poster').value,
        description: document.getElementById('description').value,
        Ubication: document.getElementById('ubication').value,
        Estado: parseInt(document.getElementById('estado').value)
    };

    document.getElementById('jsonResult').textContent = JSON.stringify(movie);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(movie)
    };

    fetch('https://movie.azurewebsites.net/api/cartelera', options)
        .then(response => {
            // Aquí la promesa se cumplió, obtuvimos una respuesta
            return response.json(); // Convertimos la respuesta a JSON
        })
        .then(data => {
            // Aquí tenemos los datos que pedimos
            console.log(data);
            showAlert('La película ha sido guardada con éxito.', 'success');

            //alert("Pelicula Guardada: " + data.Title);
            LimpiarCampos();
        })
        .catch(error => {
            // Aquí la promesa falló, manejamos el error
            showAlert('Ha ocurrido un error al guardar la película.', 'danger');
            console.error('Error:', error);
        });

}

function LimpiarCampos() {
    document.getElementById('imdbID').value = "";
    document.getElementById('title').value = "";
    document.getElementById('year').value = "";
    document.getElementById('type').value = "";
    document.getElementById('poster').value = "";
    document.getElementById('description').value = "";
    document.getElementById('ubication').value = "";
    document.getElementById('estado').value = "";

    // Limpiar la vista previa de la imagen
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = ""; // Borra el src de la imagen
    imagePreview.style.display = 'none'; // Oculta la imagen
}

function BuscarPelicula(imdbID) {
    // Si imdbID no es proporcionado, lo toma del campo de texto
    if (!imdbID) {
        imdbID = document.getElementById('imdbID').value;
    } 

    fetch('https://movie.azurewebsites.net/api/cartelera?imdbID=' + imdbID)
        .then(response => response.json())
        .then(data => {
            if (!data) {
                MsgInexistente();
                LimpiarCampos();
                return;
            } else {
                console.log(data);
                document.getElementById('imdbID').value = data.imdbID;
                document.getElementById('title').value = data.Title;
                document.getElementById('year').value = data.Year;
                document.getElementById('type').value = data.Type;
                document.getElementById('poster').value = data.Poster;
                document.getElementById('description').value = data.description;
                document.getElementById('ubication').value = data.Ubication;
                document.getElementById('estado').value = data.Estado ? 1 : 0;

                // Actualizar vista previa de la imagen
                const imagePreview = document.getElementById('imagePreview');
                imagePreview.src = data.Poster;
                imagePreview.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function ActualizarPelicula() {
    const movie = {
        imdbID: document.getElementById('imdbID').value,
        Title: document.getElementById('title').value,
        Year: document.getElementById('year').value,
        Type: document.getElementById('type').value,
        Poster: document.getElementById('poster').value,
        description: document.getElementById('description').value,
        Ubication: document.getElementById('ubication').value,
        Estado: parseInt(document.getElementById('estado').value)
    };

    document.getElementById('jsonResult').textContent = JSON.stringify(movie);

    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(movie)
    };

    //fetch('https://movie.azurewebsites.net/api/cartelera', options)
    fetch('https://movie.azurewebsites.net/api/cartelera?imdbID=' + movie.imdbID, options)
        .then(response => {
            // Aquí la promesa se cumplió, obtuvimos una respuesta
            return response.json(); // Convertimos la respuesta a JSON
        })
        .then(data => {
            // Aquí tenemos los datos que pedimos
            console.log(data);
            showAlert('La película ha sido Actualizada con exito.', 'success');
            //alert("Pelicula Actualizada: " + data.Title);
            LimpiarCampos();
        })
        .catch(error => {
            // Aquí la promesa falló, manejamos el error
            showAlert('Ha ocurrido un error al actualizar la película.', 'danger');
            console.error('Error:', error);
        });
}

function EliminarPelicula() {
    const imdbID = document.getElementById('imdbID').value;

    // Verificar si el usuario está seguro
    const confirmDelete = confirm("¿Está seguro que desea eliminar esta película?");
    
    if (!confirmDelete) {
        // Si el usuario cancela, no se elimina la película
        alert("Operación cancelada.");
        return;
    }

    const options = {
        method: "DELETE"
    };

    fetch('https://movie.azurewebsites.net/api/cartelera?imdbID=' + imdbID, options)
        .then(response => {
            // Aquí la promesa se cumplió, obtuvimos una respuesta
            return response.json(); // Convertimos la respuesta a JSON
        })
        .then(data => {
            // Aquí tenemos los datos que pedimos
            showAlert('La película ha sido eliminada con éxito.', 'success');
            //alert("Pelicula Eliminada: " + data.Title);
            LimpiarCampos();
        })
        .catch(error => {
            // Aquí la promesa falló, manejamos el error
            showAlert('Ha ocurrido un error al eliminar la película.', 'danger');
            console.error('Error:', error);
        });
}

function MsgInexistente() {
    showAlert('La película no existe.', 'warning');
}

function reset() {
    LimpiarCampos();
}

// FUNCIONES PARA MENSAJES DE ALERTAS****************************************************
function showAlert(message, type = 'success') {
    const alertMessage = document.getElementById('alertMessage');
    
    // Cambiar el contenido del mensaje
    alertMessage.innerHTML = `<strong>${type === 'success' ? '¡Éxito!' : '¡Atención!'}</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    
    // Cambiar el tipo de alerta (success, danger, warning, info)
    alertMessage.classList.remove('alert-success', 'alert-danger', 'alert-warning', 'alert-info');
    alertMessage.classList.add('alert-' + type);
    
    // Mostrar la alerta
    alertMessage.style.display = 'block';

    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 2000);
}