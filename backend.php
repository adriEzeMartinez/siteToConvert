<?php
//Constante EP para ver desde donde accedemos
if (!defined('FRAMESECURE'))
	die('Hacking attempt...');

class adminController
{
	/*
	* Login Function
	*/
    public function doLogin()
    {
		$resultLogin = $this->doCall('https://adriezemartinez.pythonanywhere.com/siteMocks/coin/getuserlogin.php&format.json', array('mailusr: '.$_GET["email"], 'passusr: '.$_GET["password"]), true);

		//Check data OK, if it is OK then create a globalhash to ensure user cant alter session on frontend
		$resultDecoded = json_decode($resultLogin, true);

		if(isset($resultDecoded["userinfo"]["username"]))
		{
			$time = time();
			$resultDecoded["sessionHash"] = $this->encrypt($resultDecoded["userinfo"]["name"].$resultDecoded["userinfo"]["surname"].$resultDecoded["userinfo"]["username"]["#text"].$time.$resultDecoded["userinfo"]["country"]["#text"]);
			$resultDecoded["time"] = $time;
			$_SESSION["TradeHash"] = $resultDecoded["sessionHash"];
		}


        echo json_encode($resultDecoded);
	}

	/*
	* Generate Login Security hash
	*/
	public function doCheckLogin()
	{
		if(isset($_SESSION["TradeHash"]))
		{
			if($_SESSION["TradeHash"] == $this->encrypt($_GET["name"].$_GET["surname"].$_GET["username"].$_GET["time"].$_GET["country"]))
			{
				echo json_encode(true);
			}
			else
			{
				unset($_SESSION["TradeHash"]);
				echo json_encode(false);
			}
		}
		else
		{
			echo json_encode(false);
		}
	}

	/*
	* Get panel robot tickets
	*/
	public function doGetTickers()
	{
		echo $this->doCall('https://adriezemartinez.pythonanywhere.com/siteMocks/coin/gettickerlsit.php&format=json', array('type' => $_GET["type"]));
	}

	/*
	* Add ticker to user panel list
	*/
	public function doAddTicker()
	{
		//utilizar la variable $_GET["type"] reemplazando BYMA para que el sistema envie el simbolo del elemento real
		echo json_encode($this->doCall('https://adriezemartinez.pythonanywhere.com/siteMocks/coin/addtickertopane.php&simbolo=BYMA', array()));
	}

	/*
	* Get Notif
	*/
	public function doGetNotif()
	{
		echo $this->doCall('https://adriezemartinez.pythonanywhere.com/siteMocks/coin/getnotificaalertas.php&format.json', array());
	}

	/*
	* Get Indicadores
	*/
	public function doGetIndicadores()
	{
		echo $this->doCall('https://adriezemartinez.pythonanywhere.com/siteMocks/coin/getindicadoreslist.php&format.json', array());
	}

	/*
	* Get panel robot tickets
	*/
	public function doGetMiPanel()
	{

		//Quitar comentario a la linea de a abajo cuando el mock se corrija
		echo $this->doCall('https://adriezemartinez.pythonanywhere.com/siteMocks/coin/getmipanel.php&format.json', array());

		//Comentar o quitar linea de abajo cuando el mock sea corregido
		//echo file_get_contents('mipanel.json');
	}
	
	/*
	* Get panel coin dashboard tickets
	*/
	public function doGetMiDashboard()
	{

		//Quitar comentario a la linea de a abajo cuando el mock se corrija
		echo $this->doCall('https://adriezemartinez.pythonanywhere.com/siteMocks/coin/getmidashboard.php&format.json', array());

		//Comentar o quitar linea de abajo cuando el mock sea corregido
		//echo file_get_contents('mipanel.json');
	}

	/*
	* Get Graph Data
	*/
	public function doGetGraphData()
	{
		//Quitar comentario a la linea de a abajo cuando el mock se corrija
		echo $this->doCall('https://adriezemartinez.pythonanywhere.com/siteMocks/coin/getindicadoresvalues.php&format.json', $_GET);
	}

	/*
	* Change password
	*/
	function doChangePass()
	{
		echo $this->doCall('https://adriezemartinez.pythonanywhere.com/siteMocks/coin/cambiopass.php&format.json', array("passactual" => $_GET["oldPass"], "passnueva" => $_GET["newPass"]));
	}

	/*
	* Register New User
	*/
	function doRegister()
	{
		echo $this->doCall('https://adriezemartinez.pythonanywhere.com/siteMocks/coin/registrate.php&format.json', array("usrnuevo" => $_GET["newUser"], "passnueva" => $_GET["newPass"]), true);
	}

    /*
    * Get && Process data function
    */
    public function doCall($url, $data = array(), $pass = false)
    {
		if(isset($_SESSION["TradeHash"]) || $pass)
		{
			$curl = curl_init();
			// Set some options - we are passing in a useragent too here
			curl_setopt_array($curl, array(
				CURLOPT_RETURNTRANSFER => 1,
				CURLOPT_HTTPHEADER => $data,
				CURLOPT_URL => $url,
			));

			// Send the request & save response to $resp
			$resp = curl_exec($curl);

			// Close request to clear up some resources
			curl_close($curl);

			return $resp;
		}
		else
		{
			return false;
		}
	}
	
	/*
	* Encrypt
	*/
	function encrypt($text)
	{
        return MD5(SHA1(CODECRIPT.$text.CODECRIPT));
	}

}