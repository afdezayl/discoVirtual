<?php
    require "./../../seguridad/disco/Session.php";

    Session::start();
    if (!Session::isValidSession()) {
        header("Location: login.php");
        exit;
    }

    $nFiles = ini_get('max_file_uploads');

    $strFilesize = ini_get('upload_max_filesize');
    $maxFilesize = getBytes($strFilesize);
    
    $strTotalSize = ini_get('post_max_size');
    $totalSize = getBytes($strTotalSize);

    function getBytes($str) {
        $unit = substr($str,-1);
        $size = substr($str, 0, -1);

        switch ($unit) {
            case 'G':
                $size *= 1024;
            case 'M':
                $size *= 1024;
            case 'K':
                $size *= 1024;
                break;
        }

        return $size;
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

    <script src="./javascript/customModals.js" defer></script>
    <script src="./javascript/discoDuro.js" defer></script>
</head>

<body>
    <header>
        <h1>Disco Duro Virtual</h1>
        <a href="./cerrarSesion.php" aria-label="logout">
            <i class="icon logout btn_icon" alt="logout">Logout</i>
        </a>
    </header>

    <main>        
        <div id="path"></div>

        <table id="folder">
                <thead>
                    <tr>                    
                        <th>Nombre</th>
                        <th class="size">Tamaño</th>
                        <th class="options">
                            <i id="mkdir" class="icon new_folder">Crear carpeta</i>   
                            <i id="folder_up" class="icon folder_up">Subir carpeta</i>
                        </th>
                    </tr>
                </thead>
                
                <tbody id="user_files">
                </tbody>
        </table>             
       
        <form action="#" method="post" enctype="multipart/form-data" id="form">           
            <div>                
                <label for="input_file">
                    <span class="btn_upload">
                        <i class="icon upload"></i>Seleccionar archivos
                    </span>                        
                </label>

                <div id="files_log"></div>
                
                <input type="hidden" name="MAX_FILE_SIZE" value="<?php echo $maxFilesize; ?>" data-totalSize="<?php echo $totalSize ?>" data-totalFiles="<?php echo $nFiles ?>" />
                <input type="file" name="files[]" id="input_file" multiple="multiple" required="required" />
            </div>
            <button type="submit">Enviar</button>
        </form>
      
    </main>   

</body>

</html>
