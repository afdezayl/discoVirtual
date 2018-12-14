<?php
    require "./../../../seguridad/disco/Session.php";
    require "./../../../seguridad/disco/DiscoDuroDB.php";

    Session::start();
    if(!Session::isValidSession()) {
        echo json_encode(["Error" => "Usuario no autorizado"]);
        exit;
    }

    if (!isset($_FILES['files'])) { 
        echo json_encode(["Error" => "No se han enviado archivos"]);       
        exit;
    }

    echo json_encode($_FILES['files']['name']);