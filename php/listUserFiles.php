<?php
    require "./../../../seguridad/disco/Session.php";
    require "./../../../seguridad/disco/DiscoDuroDB.php";

    Session::start();
    if(!Session::isValidSession()) {
        echo "Usuario no autorizado";
        exit;
    }

    $user = $_SESSION['user'];

    $DB = new DiscoDuroDB();
    $files = $DB->getUserFileList($user);

    echo json_encode($files);