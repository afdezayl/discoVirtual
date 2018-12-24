<?php
    require "./../../../seguridad/disco/Session.php";
    require "./../../../seguridad/disco/DiscoDuroDB.php";

    Session::start();
    if (!Session::isValidSession()) {
        echo json_encode(["Error" => "Usuario no autorizado"]);
        exit;
    }

    $id = isset($_POST['id']) && strlen($_POST['id']) == 23
        ? strip_tags(trim($_POST['id']))
        : null;
    
    $user = $_SESSION['user'];
    $DB = new DiscoDuroDB();
    
    if (is_null($id) && (!$DB->isFile($user, $id))) {
        echo json_encode(["Error" => "Id no válido"]);
        exit;
    }

    $file = $DB->getFile($id, $user);

    $nombre = $file['nombre'];
    $tipo = $file['tipoMime'];
    $size = $file['tamanyo'];
    $ruta = $DB->getRootFolder($user).$id;
    
    header("Content-Disposition: attachment; filename=$nombre");
    header("Content-Type: $tipo");
    
    //Limpia el buffer de salida, sin ello podría alterar algunos tipos de archivos
    ob_clean();       
    readfile($ruta);
    exit;