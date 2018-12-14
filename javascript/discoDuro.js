window.addEventListener('load', start);

function start() {
    listUserFiles();

    const form = document.getElementById('form');
    form.addEventListener('submit', sendFiles);

    const inputFiles = form.querySelector("#input_file");
    inputFiles.addEventListener("change", manageFile);
}

function listUserFiles() {
    const url = "./php/listUserFiles.php";

    const init = {
        method: 'POST',
        credentials: 'same-origin'
    };

    fetch(url, init)
        .then(data=> data.json())
        .then(json => printFiles(json));
}

function printFiles(json) {
    console.table(json);
    const fileUserList = document.getElementById("user_files");
    
    let files = "<h2>Tus archivos</h2>";    

    json.forEach(file => files += `<p>${file.nombre}, ${file.tamanyo} KB</p>`);
    
    fileUserList.innerHTML = "";
    fileUserList.insertAdjacentHTML("beforeend", files);
}

function sendFiles(ev) {
    ev.preventDefault();

    console.log(ev);
}

/*function sendFile(ev) {
    ev.preventDefault();

    const data = new FormData(this);

    const init = {
        method: 'POST',
        credentials: 'same-origin',
        body: data
    };

    const url = "./php/upload.php";

    fetch(url, init)
        .then(data => data.text())
        .then(txt => console.log(txt))
        .catch(() => console.log("Error al conectar con el servidor"));
}*/

function manageFile(ev) {
    console.log(ev.target.files);
    const files = Array.from(ev.target.files);
    const uploadFiles = document.getElementById("upload_files");

    uploadFiles.innerHTML = files.reduce((txt,file) => txt + `<p>${file.name}</p>`,"");
}

