<?php
class DiscoDuroDB
{
    private $SERVIDOR = "localhost";
    private $USUARIO = "discoduro";
    private $PASSWORD = "discoduro";
    private $BBDD = "discoduro";
    private $CONEXION;

    public function __construct()
    {
        $this->CONEXION = $this->getConexion();
    }

    private function getConexion()
    {
        $conexion = new mysqli($this->SERVIDOR, $this->USUARIO, $this->PASSWORD, $this->BBDD);

        if ($conexion->connect_errno) {
            echo json_encode(["ERROR"=>"Fallo al conectar a MySQL"]);
            exit;
        }
        if (!$conexion->set_charset("utf8")) {
            echo "Error con utf-8";
            exit;
        }

        return $conexion;
    }    

    public function getPassword($user)
    {
        $conexion = $this->CONEXION;

        $consultaSql = "SELECT clave
                    FROM USUARIOS
                    WHERE usuario=?";
        
        $consultaPreparada = $conexion->prepare($consultaSql);
        $consultaPreparada->bind_param('s', $user);

        $consultaPreparada->execute();

        $consultaPreparada->bind_result($clave);
        $consultaPreparada->fetch();

        return $clave;
    }

    public function getUserFileList($user) {
        $conexion = $this->CONEXION;

        $consultaSql = "SELECT *
                    FROM FICHEROS
                    WHERE usuario=?";

        $consultaPreparada = $conexion->prepare($consultaSql);
        $consultaPreparada->bind_param('s', $user);

        $consultaPreparada->execute();
        $resultado = $consultaPreparada->get_result();

        $files = array();
        
        while($file = $resultado->fetch_assoc()) {
            array_push($files, $file);
        }

        return $files;
    }
}
