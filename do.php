<?php

//Definimos la constante de seguridad
define("FRAMESECURE", 1);
session_start();

//Defile encrypt hash
define("CODECRIPT", "as88GH<df6554!°¡?9fDFGTR49493109877949565tgregerwgsdHT<dvdfsvf..,ñ{p+$%&V++--8sadsa63");

include('backend.php');

$back = new adminController();

if(isset($_GET["action"]))
{
    $method = "do".ucfirst($_GET["action"]);

    if(method_exists($back, $method))
    {
        $back->$method();
    }
    else
    {
        echo json_encode(false);
    }
}