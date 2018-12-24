window.addEventListener('load', start);

function start() {
    getFolderFiles();

    const form = document.getElementById('form');
    form.addEventListener('submit', sendFiles);

    const inputFiles = form.querySelector("#input_file");
    inputFiles.addEventListener("change", manageFile);

    const btnMkdir = document.getElementById('mkdir');
    btnMkdir.addEventListener('click', mkdir);

    const btnfolderUp = document.getElementById('folder_up');
    btnfolderUp.addEventListener('click', folderUp);
}

//En un set no se pueden añadir elementos repetidos
const path = new Set();

function folderUp() {
    if (path.size > 1) {
        path.delete(getCurrentFolder());
    }

    getFolderFiles(getCurrentFolder());
}

function getCurrentFolder() {
    const lastIndex = path.size - 1;
    const array = Array.from(path);

    return array[lastIndex];
}

//Mostrar carpetas y archivos
function getFolderFiles(parentID) {
    const folder = this.id || parentID || null;

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
        .catch(err => console.log("Error al conectar con la base de datos"));
}

function printFiles(response) {
    const fileUserList = document.getElementById("user_files");

    //Ruta seguida
    path.add(response.parentID);

    let txt = "";

    for (const file of response.files) {
        if (file.tipoFichero === "D") {
            txt += printFolder(file);
        } else {
            txt += printFile(file);
        }
    }

    fileUserList.innerHTML = "";
    fileUserList.insertAdjacentHTML("beforeend", txt);

    response.files
        .filter(file => file.tipoFichero === "D")
        .forEach(file => document.getElementById(file.id).addEventListener('click', getFolderFiles));

    document.querySelectorAll('i[data-remove]')
        .forEach(icon => icon.addEventListener('click', deleteFile));

    document.querySelectorAll('i[data-download]')
        .forEach(icon => icon.addEventListener('click', downloadFile));
}

function printFolder(file) {
    return `
        <tr id="${file.id}">
            <td>
                <i class="icon folder"></i> ${file.nombre}
            </td>
            <td class="size">
                <p>---</p>
            </td>
            <td class="options">
                <i class="icon delete" data-remove="${file.id}">Borrar</i>
            </td>
        </tr>`;
}

function printFile(file) {
    return `
        <tr>
            <td>
                <i class="icon file"></i> ${file.nombre}
            </td>
            <td class="size">
                <p>${(file.tamanyo/1024).toFixed(0)} KB</p>
            </td>
            <td class="options">
                <i class="icon download" data-download="${file.id}">Descargar</i>
                <i class="icon delete" data-remove="${file.id}">Borrar</i>
            </td>
        </tr>`;
}

//Borrar archivos y carpetas
function deleteFile(ev) {
    ev.stopPropagation();

    const confirmation = confirm("¿Seguro que desea borrar el contenido?");
    if(confirmation === false) {
        return;
    }

    const folder = this.getAttribute('data-remove');

    const data = new FormData();
    data.append('folder', folder);

    const init = {
        method: 'POST',
        credentials: 'same-origin',
        body: data
    };

    const url = "./php/deleteFile.php";

    fetch(url, init)
        .then(data => data.text())
        .then(txt => console.log(txt))
        .then(() => getFolderFiles(getCurrentFolder()))
        .catch(err => console.log(err));
}

//Descargar y guardar archivos
function downloadFile(ev) {
    ev.stopPropagation();

    const id = this.getAttribute('data-download');

    const data = new FormData();
    data.append('id', id);

    const init = {
        method: 'POST',
        credentials: 'same-origin',
        body: data
    };

    const url = "./php/downloadFile.php";

    let fileName = "";
    fetch(url, init)
        .then(data => {
            fileName = data.headers.get('Content-Disposition');
            fileName = fileName.split(";")[1].split("=")[1];
            const blob = data.blob();

            return blob;
        })
        .then(blob => saveFile(blob, fileName))
        .catch(err => console.log(err));
}

function saveFile(blob, fileName) {    
    const url = window.URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.target = "_blank";
    a.click();
}

//Crear carpeta
function mkdir() {
    const parentID = getCurrentFolder();

    let newFolder;
    const regex = /\w{1,255}/;

    do {
        newFolder = prompt("Introduce el nombre de la nueva carpeta: ");
    } while (!regex.test(newFolder));

    const data = new FormData();
    data.append('newFolder', newFolder);
    data.append('parentID', parentID);

    const init = {
        method: 'POST',
        credentials: 'same-origin',
        body: data
    };

    const url = "./php/mkdir.php";

    if (newFolder) {
        fetch(url, init)
            .then(data => data.json())
            .then(json => console.log(json))
            .then(() => getFolderFiles(parentID))
            .catch(err => alert("Error al crear la carpeta"));
    }
}

//Subida de archivos
function manageFile(ev) {
    const files = Array.from(ev.target.files);

    const hidden = document.querySelector('input[name="MAX_FILE_SIZE"]');
    const maxSize = hidden.value;
    const maxTotalSize = hidden.getAttribute('data-totalSize');
    const maxNumFiles = hidden.getAttribute('data-totalFiles');

    //Busca si algún archivo excede el tamaño máximo definido
    const check1 = files.reduce((pre, file) => pre && (file.size <= maxSize), true);

    //Comprueba que no se supere el tamaño máximo del conjunto de archivos    
    const check2 = files.reduce((pre, file) => pre + file.size, 0) <= maxTotalSize;

    //Comprueba que no se exceda el número máximo de archivos
    const check3 = files.length <= maxNumFiles;

    if (check1 && check2 && check3) {
        const log = document.getElementById('files_log');
        log.innerHTML = files.reduce((txt, file) => txt + `<p>${file.name}</p>`, "");
    } else {
        const form = document.getElementById('form');
        form.reset();

        let error = "Error, archivos no válidos:\n";
        if (check1 === false)
            error += `- Algún archivo supera ${maxSize/1024/1024} MB\n`;
        if (check2 === false)
            error += `- El conjunto de archivos supera ${maxTotalSize/1024/1024} MB\n`;
        if (check3 === false)
            error += `- Máximo de ${maxNumFiles} archivos por subida\n`;

        alert(error);
        ev.target.click();
    }
}

function sendFiles(ev) {
    ev.preventDefault();

    const data = new FormData(this);    
    data.append("idDepende", getCurrentFolder());
        
    const init = {
        method: 'POST',
        credentials: 'same-origin',
        body: data
    };

    const url = "./php/uploadFile.php";

    fetch(url, init)
        .then(() => getFolderFiles(getCurrentFolder()))
        .then(() => {
            this.reset();
            const log = document.getElementById('files_log');
            log.innerHTML = "";
        })
        .catch(err => console.log(err));    
}

