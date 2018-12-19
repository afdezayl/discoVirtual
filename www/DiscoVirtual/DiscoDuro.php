<?php
    require "./../../seguridad/disco/Session.php";

    Session::start();
    if (!Session::isValidSession()) {
        header("Location: login.php");
        exit;
    }
?>

<!DOCTYPE html>
<html lang="es-ES">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="cloud, data, storage" />
    <meta name="theme-color" content="#7a7cff"/>

    <title>Login</title>
    <link rel="icon" href="./img/database.svg" sizes="any" type="image/svg+xml" />
    <link rel="stylesheet" href="./styles/style.css" />

    <script src="./javascript/discoDuro.js"></script>
</head>

<body>
    <header>
        <h1>Disco Duro Virtual</h1>
        <a href="./cerrarSesion.php" aria-label="logout">
            <i class="icon logout btn_icon" alt="logout"></i>
        </a>
    </header>

    <main>
        <h2>Tus archivos</h2>
        <div>
            <span>/</span>
                    
        </div>

        <table id="folder">
                <thead>
                    <tr>                    
                        <th>Nombre</th>
                        <th>
                            <i id="mkdir" class="icon new_folder">Crear carpeta</i>   
                            <i id="folder_up" class="icon folder_up">Subir carpeta</i>
                        </th>
                    </tr>
                </thead>
                
                <tbody id="user_files">
                </tbody>
                <tr>
                    <td><i id="aaaa" class="icon file"></i> Prueba</td>
                    <td>
                        <i class="icon download"></i>
                        <i class="icon delete"></i>
                    </td>
                </tr>
        </table>             
       
        <form action="" method="post" enctype="multipart/form-data" id="form">            
            <div id="upload_files"></div>

            <div>
                <label for="input_file">
                    <span class="btn_upload">
                        <i class="icon upload"></i>Subir archivos
                    </span>                        
                </label>
                <input type="file" name="files[]" id="input_file" multiple="multiple" required="required" />
            </div>
            <button type="submit">Enviar</button>
        </form>
      
    </main>   

</body>

</html>
