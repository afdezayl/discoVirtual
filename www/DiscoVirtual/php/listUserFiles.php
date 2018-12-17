<?php
    require "./../../../seguridad/disco/Session.php";
    require "./../../../seguridad/disco/DiscoDuroDB.php";

    Session::start();
    if(!Session::isValidSession()) {
        echo "Usuario no autorizado";
        exit;
    }

    $folder = isset($_POST['folder']) && strlen($_POST['folder']) == 23
        ? strip_tags(trim($_POST['folder']))
        : null;

    $user = $_SESSION['user'];

    $DB = new DiscoDuroDB();

    if(is_null($folder)) {
        $folder = $DB->getRootID($user);
        $files = $DB->getFileList($user, $folder);
    } else {
        $files = $DB->getFileList($user, $folder);
    }    

    echo json_encode([
        "parentID"=>$folder,
        "files"=>$files
        ]);