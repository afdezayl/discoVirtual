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
        .catch(err => alert("Error al conectar con la base de datos"));
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

    //Añadir eventos
    for (const file of response.files) {
        const element = document.getElementById(file.id);
        if (file.tipoFichero === "D") {
            element.addEventListener('click', getFolderFiles);
        } else {
            element.addEventListener('click', () => console.log("file"));
        }
    }
}

function printFolder(file) {
    return `
        <tr id="${file.id}">
            <td><i class="icon folder"></i> ${file.nombre}</td>
            <td><i class="icon delete" data-remove="${file.id}"></i></td>
        </tr>`;
}

function printFile(file) {
    return `
        <tr>
            <td>
                <i id="${file.id}" class="icon file"></i> ${file.nombre}
            </td>
            <td>
                <i class="icon download" data-download="${file.id}"></i>
                <i class="icon delete" data-remove="${file.id}"></i>
            </td>
        </tr>`;
}

function mkdir() {
    //Id de la carpeta padre
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

function sendFiles(ev) {
    ev.preventDefault();

    console.log("folder:"+getCurrentFolder());

    const data = new FormData(this);
    data.append("idDepende", getCurrentFolder());

    const init = {
        method: 'POST',
        credentials: 'same-origin',
        body: data
    };

    const url = "./php/uploadFile.php";

    fetch(url, init)
        .then(data => data.text())
        .then(txt => console.log(txt));
    // .then(data => data.json())
    // .then(json => console.table(json))
    // .catch(() => console.log("ERROR"));
    //console.log(this.elements);
}

function manageFile(ev) {
    const files = Array.from(ev.target.files);
    //console.log(files);
    const uploadFiles = document.getElementById("upload_files");

    uploadFiles.innerHTML = files.reduce((txt, file) => txt + `<p>${file.name}</p>`, "");


}