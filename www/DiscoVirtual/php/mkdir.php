<?php
    require "./../../../seguridad/disco/Session.php";
    require "./../../../seguridad/disco/DiscoDuroDB.php";

    Session::start();
    if (!Session::isValidSession()) {
        echo "Usuario no autorizado";
        exit;
    }

    $newFolder = isset($_SESSION['newFolder']) && strlen($_SESSION['newFolder']) <=255
            ? strip_tags(trim($_SESSION['newFolder']))
            : null;

    $id_depende = isset($_SESSION['parentID']) && strlen($_SESSION['parentID']) == 23
            ? strip_tags(trim($_SESSION['parentID']))
            : "";

    $user = $_SESSION['user'];

    $DB = new DiscoDuroDB();
    $isUserDir = $DB->isUserDir($user, $id_depende);

    if (is_null($newFolder) || (!$isUserDir)) {
        echo "Nombre o id directorio padre no válido";
        exit;
    }    

    $id = uniqid('', true);
    
    $insertado = $DB->makeDir($id, $newFolder, $user, $id_depende);

    return json_encode(["response" => $insertado]);
