window.addEventListener('load', start);

function start() {
    getFolderFiles();

    const form = document.getElementById('form');
    form.addEventListener('submit', sendFiles);

    const inputFiles = form.querySelector("#input_file");
    inputFiles.addEventListener("change", manageFile);

    const btnMkdir = document.getElementById('mkdir');
    btnMkdir.addEventListener('click', mkdir);
}

function getFolderFiles() {
    const folder = this.id || null;

    const url = "./php/listUserFiles.php";

    const data = new FormData();
    data.append("folder", folder);

    const init = {
        method: 'POST',
        credentials: 'same-origin',
        body: data
    };

    fetch(url, init)
        .then(data => data.json())
        .then(json => printFiles(json))
        .catch(err => alert("Error al conectar con la base de datos"));
}

function printFiles(response) {
    console.table(response);
    const fileUserList = document.getElementById("user_files");

    let txt = `<table data-parent="${response.parentID}">
                <tr>
                    <th>Tipo</th>
                    <th>Nombre</th>
                    <th>Opciones</th>
                </tr>`;

    for (file of response.files) {
        if (file.tipoFichero === "D") {
            txt += printFolder(file);
        } else {
            txt += printFile(file);
        }
    }

    txt += "</table>";

    fileUserList.innerHTML = "";
    fileUserList.insertAdjacentHTML("beforeend", txt);

    //Añadir eventos
    for (file of response.files) {
        const element = document.getElementById(file.id);
        if (file.tipoFichero === "D") {
            element.addEventListener('dblclick', getFolderFiles);
        } else {
            element.addEventListener('dblclick', () => console.log("file"));
        }
    }
}

function printFolder(file) {
    return `<tr>
            <td><i id="${file.id}" class="icon folder"></i><td>
            <td>${file.nombre}</td>
            <td>Ir al directorio</td>
        </tr>`;
}

function printFile(file) {
    return `<tr>
            <td><i id="${file.id}" class="icon file"></i><td>
            <td>${file.nombre}</td>
            <td>Descargar, Borrar</td>
        </tr>`;
}

function mkdir() {
    //Id de la carpeta padre
    const parentID = document.querySelector("table[data-parent]").attributes['data-parent'].value;
    
    let newFolder;
    const regex = /\w{1,255}/;

    do {
        newFolder = prompt("Introduce el nombre de la nueva carpeta: ");
    } while (!newFolder.test(regex));
    
    const data = new FormData();
    data.append('newFolder', newFolder);

    const init = {
        method: 'POST',
        credentials: 'same-origin',
        body: data
    };

    const url = "./php/mkdir.php";

    fetch(url, init)
        .then(data => data.json())
        .then(json => console.log(json));
}

function sendFiles(ev) {
    ev.preventDefault();

    const data = new FormData(this);

    const init = {
        method: 'POST',
        credentials: 'same-origin',
        body: data
    };

    const url = "./php/uploadFile.php";

    fetch(url, init)
        .then(data => data.json())
        .then(json => console.log(json))
        .catch(() => console.log("ERROR"));
    //console.log(this.elements);
}

/*function sendFile(ev) {
    ev.preventDefault();

    const data = new FormData(this);

    const init = {
        method : 'POST',
        credentials : 'same-origin',
        body : data
    };

    const url = "./php/upload.php";

    fetch(url, init)
        .then(data => data.text())
        .then(txt => console.log(txt))
        .catch(() => console.log("Error al conectar con el servidor"));
}*/

function manageFile(ev) {
    const files = Array.from(ev.target.files);
    console.log(files);
    const uploadFiles = document.getElementById("upload_files");

    uploadFiles.innerHTML = files.reduce((txt, file) => txt + `<p>${file.name}</p>`, "");


}