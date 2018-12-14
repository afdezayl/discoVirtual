<?php
    require "/../../seguridad/Sesiones/Session.php";
    Session::start();
    
    $_SESSION = [];
    session_destroy();

    header("Location: login.php");