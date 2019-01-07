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
let pathNames = ['Principal'];

function folderUp() {
    if (path.size > 1) {
        path.delete(getCurrentFolder());
        pathNames = pathNames.slice(0, path.size);
    }    
    
    getFolderFiles(getCurrentFolder());
}

function getCurrentFolder() {
    const lastIndex = path.size - 1;
    const array = Array.from(path);

    return array[lastIndex];
}

function updatePath() {
    const pathOutput = document.getElementById('path');
    pathOutput.innerText = pathNames.reduce((pre,folder) => pre + folder + "/", "");
}

//Mostrar carpetas y archivos
function getFolderFiles(parentID) {
    const folder = this.id || parentID || null;

    if(this.id) {
        pathNames.push(this.childNodes[1].innerText.trim());
    }
    updatePath();
    
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
        .catch(err => new CustomAlert("Error", "Lo sentimos, no ha sido posible conectar con la base de datos"));
}

function printFiles(response) {
    const fileUserList = document.getElementById("user_files");

    //Ruta seguida
    path.add(response.parentID);   

    const files = response.files;
    let txt = "";

    if (files.length === 0) {
        txt += `<tr>
                    <td colspan="2" style="text-align: center">Este directorio está vacío</td>
                    <td class="size"></td>                    
                </tr>`;
    }

    for (const file of files) {
        if (file.tipoFichero === "D") {
            txt += printFolder(file);
        } else {
            txt += printFile(file);
        }
    }

    fileUserList.innerHTML = "";
    fileUserList.insertAdjacentHTML("beforeend", txt);

    files
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

    new CustomConfirm(
        'Borrar elemento',
        '¿Estás seguro de borrar el elemento seleccionado?',
        (confirmation) => {
            if (confirmation === false) {
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
                .catch(err => new CustomAlert("Error", "Lo sentimos, no ha sido posible conectar con la base de datos"));
        }
    );
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
        .catch(err => new CustomAlert("Error", "Lo sentimos, no ha sido posible conectar con la base de datos"));
}

function saveFile(blob, fileName) {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.target = "_blank";
    a.click();
}

//Crear carpeta
function mkdir() {
    const parentID = getCurrentFolder();    

    new CustomPrompt(
        'Crear nueva carpeta',
        'Nombre:',
        (newFolder) => {
            if(newFolder == null) {
                return;
            }

            const regex = /^\w{1,255}$/;
            if(!regex.test(newFolder)) {
                new CustomAlert('Error', 'Nombre de directorio no válido', mkdir);                
                return;
            }
            
            const data = new FormData();
            data.append('newFolder', newFolder);
            data.append('parentID', parentID);

            const init = {
                method: 'POST',
                credentials: 'same-origin',
                body: data
            };

            const url = "./php/mkdir.php";
            
            fetch(url, init)
                .then(data => data.json())
                .then(json => console.log(json))
                .then(() => getFolderFiles(parentID))
                .catch(err => new CustomAlert("Error", "No ha sido posible crear la carpeta"));            
        }
    );
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
        log.innerHTML = files.reduce((txt, file) => txt + `<p>${file.name}, ${(file.size/1024).toFixed(0)} KB</p>`, "");
    } else {
        const form = document.getElementById('form');
        form.reset();

        let error = "<ul>";
        if (check1 === false)
            error += `<li>Algún archivo supera ${maxSize/1024/1024} MB</li>`;
        if (check2 === false)
            error += `<li>El conjunto de archivos supera ${maxTotalSize/1024/1024} MB</li>`;
        if (check3 === false)
            error += `<li>Máximo de ${maxNumFiles} archivos por subida</li>`;

        new CustomAlert("Archivos no válidos:", error + "</ul>", () => {
            ev.target.click();
        });               
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
        .catch(err => new CustomAlert("Error", "Lo sentimos, no ha sido posible conectar con la base de datos"));
}