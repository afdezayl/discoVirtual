<?php
    require "./../../seguridad/disco/DiscoDuroDB.php";
    require "./../../seguridad/disco/Session.php";

    Session::start();
    if (Session::isValidSession()) {
        header("Location: DiscoDuro.php");
        exit;
    }

    $user = isset($_POST['user']) && strlen($_POST['user']) <= 15
        ? strip_tags(trim($_POST['user']))
        : "";
    $pass = isset($_POST['pass']) && strlen($_POST['pass']) <= 20
        ? strip_tags(trim($_POST['pass']))
        : "";

    $txt="";    

    $DB = new DiscoDuroDB();
    $passDB = $DB->getPassword($user);

    if ($user && $pass && password_verify($pass, $passDB)) {        
        Session::setValues(["user"=>$user]);
                
        header("Location: DiscoDuro.php");
        exit;
    } else if ($user || $pass) {
        $txt="Combinación de usuario y contraseña incorrecta";
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
</head>

<body>
    <header>
        <h1>Disco Duro Virtual</h1>
    </header>

    <main>       
        <form action="" method="post" id="form" autocomplete="off">
            <p class="error"><?php echo $txt; ?></p>
            <div>
                <label for="user">Usuario</label>
                <input type="text" name="user" id="user" placeholder="Nombre de usuario" maxlength="15" />
            </div>
            
            <div>
                <label for="pass">Contraseña</label>
                <input type="password" name="pass" id="pass" placeholder="Introduzca su contraseña" maxlength="20" />
            </div>
            
            <button type="submit">Login</button>            
        </form>
    </main>   

</body>

</html>
