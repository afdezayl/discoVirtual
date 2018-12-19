<?php
    
class Session
{
    public static function start() {
        session_name('SESSION');
        session_cache_limiter('nocache');
	    session_start();
    }

    public static function isValidSession()
    {
        return  isset($_SESSION['user']);
    }

    public static function setValues($valores)
    {
        foreach ($valores as $key=>$valor) {
            $_SESSION[$key]=$valor;
        }
    }
}
