<?php
    require "./../../../seguridad/disco/Session.php";
    require "./../../../seguridad/disco/DiscoDuroDB.php";

    Session::start();
    if (!Session::isValidSession()) {
        echo "Usuario no autorizado";
        exit;
    }

    $newFolder = isset($_POST['newFolder']) && strlen($_POST['newFolder']) <=255
            ? strip_tags(trim($_POST['newFolder']))
            : null;

    $id_depende = isset($_POST['parentID']) && strlen($_POST['parentID']) == 23
            ? strip_tags(trim($_POST['parentID']))
            : "";

    $user = $_SESSION['user'];

    $DB = new DiscoDuroDB();
    $isUserDir = $DB->isUserDir($user, $id_depende);

    //echo "$newFolder, $id_depende";
    if (is_null($newFolder) || (!$isUserDir)) {
        echo "Nombre o id directorio padre no válido";
        exit;
    }    

    $id = uniqid('', true);
    
    $insertado = $DB->makeDir($id, $newFolder, $user, $id_depende);

    echo json_encode(["response" => $insertado]);
