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
            <i class="icon logout" alt="logout"></i>
        </a>
    </header>

    <main>
        <div id="user_files">
        </div>      
       
       <div>
            <form action="" method="post" enctype="multipart/form-data" id="form">
                <div id="upload_files">
                </div>

                <div>
                    <label for="input_file">
                        <i class="icon upload"></i>Subir archivos
                    </label>
                    <input type="file" name="files[]" id="input_file" multiple="multiple" />
                </div>
                <button type="submit">Enviar</button>
            </form>
       </div>
    </main>   

</body>

</html>
