<?php
    require "./../../../seguridad/disco/Session.php";
    require "./../../../seguridad/disco/DiscoDuroDB.php";

    Session::start();
    if (!Session::isValidSession()) {
        echo json_encode(["Error" => "Usuario no autorizado"]);
        exit;
    }

    $folder = isset($_POST['folder']) && strlen($_POST['folder']) == 23
        ? strip_tags(trim($_POST['folder']))
        : null;

    if (is_null($folder)) {
        echo json_encode(["Error" => "Directorio no válido"]);
        exit;
    }

    $DB = new DiscoDuroDB();

    $user = $_SESSION['user'];
    $isFile = $DB->isFile($user, $folder);

    if ($isFile && $DB->deleteFile($folder, $user)) {
        $path = $DB->getRootFolder($user).$folder;
        unlink($path);
        echo json_encode(["message" => "Archivo borrado correctamente"]);
    } elseif ($DB->deleteFile($folder, $user)) {
        echo json_encode(["message" => "Directorio borrado correctamente"]);
    } else {
        echo json_encode(["message" => "Error, no ha sido borrado"]);
    }

    exit;
