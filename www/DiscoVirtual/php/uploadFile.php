<?php
    require "./../../../seguridad/disco/Session.php";
    require "./../../../seguridad/disco/DiscoDuroDB.php";

    Session::start();
    if (!Session::isValidSession()) {
        echo json_encode(["Error" => "Usuario no autorizado"]);
        exit;
    }

    if (!isset($_FILES['files'])) {
        echo json_encode(["Error" => "No se han enviado archivos"]);
        exit;
    }
    
    $id_depende = isset($_POST['idDepende']) && strlen($_POST['idDepende']) == 23
        ? strip_tags(trim($_POST['idDepende']))
        : null;

    if (is_null($id_depende)) {
        echo json_encode(["Error" => "Directorio no válido"]);
        exit;
    }

    //Transponer la matriz $_FILES['files'] para conseguir un array
    //que cada fila sea un archivo con sus propiedades, y no un array
    //compuesto por 5 arrays de propiedades
    $files = transpose($_FILES['files']);
    
    $uploadedFiles = 0;
    $message = [];
    $user = $_SESSION['user'];

    $DB = new DiscoDuroDB();

    foreach ($files as $file) {
        $id = uniqid('', true);
        $nombre = basename($file['name']);
        $tamanyo = $file['size'];
        $tipoMime = $file['type'];
        $tmp_name = $file['tmp_name'];
        $error = $file['error'];

        echo "$id, $nombre, $tamanyo, $tipoMime, $tmp_name, $error \n";

        if ($error) {
            $message[] = getErrorMessage($nombre, $error);
        } else {
            $finalPath = $DB->getRootFolder($user).$id;
            $cuota = $DB->getCuota($user);
            $usedSpace = $DB->getUsedSpace($user);
            
            if ($cuota < $usedSpace + $tamanyo) {
                $message[] = "$nombre supera la cuota máxima";
            } elseif (move_uploaded_file($tmp_name, $finalPath)) {
                $DB->insertFile($id, $nombre, $tamanyo, $tipoMime, $user, $id_depende);

                $message[] = "$nombre subido correctamente";
                $uploadedFiles++;
            } else {
                $message[] = "Error al mover el archivo";
            }
        }
    }

    echo json_encode([
        "message" =>$message,
        "uploadedFiles" => $uploadedFiles
        ]);


    //Funciones auxiliares
    function transpose($array)
    {
        $result = array();
        foreach ($array as $key => $subarray) {
            foreach ($subarray as $subkey => $subvalue) {
                $result[$subkey][$key] = $subvalue;
            }
        }
        return $result;
    }

    function getErrorMessage($nombre, $error)
    {
        switch ($error) {
            case UPLOAD_ERR_INI_SIZE:
                $message = "$nombre supera los límites del servidor";
                break;
            case UPLOAD_ERR_FORM_SIZE:
                $message = "$nombre supera los límites establecidos en el formulario";
                break;
            case UPLOAD_ERR_PARTIAL:
                $message = "$nombre no ha sido subido totalmente";
                break;
            case UPLOAD_ERR_NO_FILE:
                $message = "No se ha subido ningún archivo";
                break;
            case UPLOAD_ERR_NO_TMP_DIR:
                $message = "No está disponible el directorio temporal";
                break;
            case UPLOAD_ERR_CANT_WRITE:
                $message = "Error al tratar de escribir en el disco";
                break;
            case UPLOAD_ERR_EXTENSION:
                $message = "La subida de $nombre ha sido cancelada por una extensión";
                break;

            default:
                $message = "Error desconocido";
                break;
        }

        return $message;
    }
