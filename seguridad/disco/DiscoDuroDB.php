<?php
class DiscoDuroDB
{
    private $SERVIDOR = "localhost";
    private $USUARIO = "discoduro2";
    private $PASSWORD = "discoduro2";
    private $BBDD = "discoduro2";    
    private $CONEXION;

    private $ALMACEN = "./../../../seguridad/ficheros/";

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
            echo json_encode(["ERROR"=>"Fallo al establecer utf8"]);
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

    public function getRootID($user)
    {
        $conexion = $this->CONEXION;

        $consultaSql = "SELECT id
                    FROM DISCO
                    WHERE usuario=?
                        and id_depende is null";
        
        $consultaPreparada = $conexion->prepare($consultaSql);
        $consultaPreparada->bind_param('s', $user);

        $consultaPreparada->execute();
        $consultaPreparada->bind_result($id);

        $consultaPreparada->fetch();

        return $id;
    }

    public function getRootFolder($user) {
        return $this->ALMACEN;
    }

    public function getFile($id, $user) {
        $conexion = $this->CONEXION;

        $consultaSql = "SELECT nombre, tipoMime, tamanyo
                    FROM DISCO
                    WHERE usuario=?
                        and id=?";

        $consultaPreparada = $conexion->prepare($consultaSql);
        $consultaPreparada->bind_param('ss', $user, $id);

        $consultaPreparada->execute();
        $resultado = $consultaPreparada->get_result();

        $file = $resultado->fetch_assoc();

        return $file;
    }

    public function getCuota($user) {
        $conexion = $this->CONEXION;

        $consultaSql = "SELECT cuota
                    FROM USUARIOS
                    WHERE usuario=?";
        
        $consultaPreparada = $conexion->prepare($consultaSql);
        $consultaPreparada->bind_param('s', $user);

        $consultaPreparada->execute();

        $consultaPreparada->bind_result($cuota);
        $consultaPreparada->fetch();

        return $cuota;
    }

    public function getUsedSpace($user) {
        $conexion = $this->CONEXION;

        $consultaSql = "SELECT sum(tamanyo)
                    FROM DISCO
                    WHERE usuario=?";
        
        $consultaPreparada = $conexion->prepare($consultaSql);
        $consultaPreparada->bind_param('s', $user);

        $consultaPreparada->execute();
        $consultaPreparada->bind_result($sum);

        $consultaPreparada->fetch();

        return $sum;
    }

    public function getFileList($user, $folder)
    {
        $conexion = $this->CONEXION;

        $consultaSql = "SELECT *
                    FROM DISCO
                    WHERE usuario=?
                        and id_depende=?";

        $consultaPreparada = $conexion->prepare($consultaSql);
        $consultaPreparada->bind_param('ss', $user, $folder);

        $consultaPreparada->execute();
        $resultado = $consultaPreparada->get_result();

        $files = array();
        
        while ($file = $resultado->fetch_assoc()) {
            array_push($files, $file);
        }

        return $files;
    }

    public function makeDir($id, $nombre, $user, $id_depende)
    {
        $conexion = $this->CONEXION;

        $consultaSql = "INSERT INTO DISCO
                    (id, nombre, tamanyo, tipoMime, tipoFichero, usuario, id_depende)
                    VALUES(?, ?, 0, NULL, 'D', ?, ?)";
        
        $consultaPreparada = $conexion->prepare($consultaSql);
        $consultaPreparada->bind_param('ssss', $id, $nombre, $user, $id_depende);

        $insertado = $consultaPreparada->execute();

        return $insertado;
    }

    public function insertFile($id, $nombre, $tamanyo, $tipoMime, $user, $id_depende) {
        $conexion = $this->CONEXION;

        $consultaSql = "INSERT INTO DISCO
                    (id, nombre, tamanyo, tipoMime, tipoFichero, usuario, id_depende)
                    VALUES(?, ?, ?, ?, 'A', ?, ?)";
        
        $consultaPreparada = $conexion->prepare($consultaSql);
        $consultaPreparada->bind_param('ssssss', $id, $nombre, $tamanyo, $tipoMime, $user, $id_depende);

        return $consultaPreparada->execute();
    }

    public function isUserDir($user, $id)
    {
        $conexion = $this->CONEXION;

        $consultaSql = "SELECT count(*)
                    FROM DISCO
                    WHERE usuario=?
                        and id=?";

        $consultaPreparada = $conexion->prepare($consultaSql);
        $consultaPreparada->bind_param('ss', $user, $id);

        $consultaPreparada->execute();

        $consultaPreparada->bind_result($count);
        $consultaPreparada->fetch();

        return $count == 1;
    }

    function deleteFile($id, $user) {
        $conexion = $this->CONEXION;

        $consultaSql = "DELETE
                    FROM DISCO
                    WHERE usuario=?
                        and id=?
                        and id_depende is not null";

        $consultaPreparada = $conexion->prepare($consultaSql);
        $consultaPreparada->bind_param('ss', $user, $id);

        return $consultaPreparada->execute();
    }

    function isFile($user, $id) {
        $conexion = $this->CONEXION;

        $consultaSql = "SELECT tipoFichero
                    FROM DISCO
                    WHERE usuario=?
                        and id=?";

        $consultaPreparada = $conexion->prepare($consultaSql);
        $consultaPreparada->bind_param('ss', $user, $id);

        $consultaPreparada->execute();

        $consultaPreparada->bind_result($type);
        $consultaPreparada->fetch();

        return $type == "A";
    }
}
