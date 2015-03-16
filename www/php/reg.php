<?php

include ('webservice.php');

if ($_POST) {

	include('db_conn.php');

	if (!$_POST['"newUid"'])
		$error .= "<br/>Please enter a username.";
	else {
		if (!preg_match('/^[A-Za-z][A-Za-z0-9]{5,31}$/',$_POST['"newUid"']))
			$error.="<br/>username must be alhpanumeric and at least 6 characters";
	}

	if (!$_POST['"newPwd"'])
		$error .= "<br/>Please enter a password.";
	else {
		if (!preg_match('/^[A-Za-z][A-Za-z0-9]{5,31}$/',$_POST['"newPwd"']))
			$error.="<br/>password must be alhpanumeric and at least 6 characters";
	}

	$data = array();

	if (!$error) {
		$uid = mysqli_real_escape_string($conn, $_POST['"newUid"']);
		$pwd = md5($secret_string.md5($_POST['"newPwd"']));	
		$sql = "INSERT INTO membership VALUES('','$uid','$pwd')";
		mysqli_query($conn, $sql);
 		
		$data['status'] = "success";
		$data['statusMsg'] = "New account ceated. You are logged in.";
		$data['uid'] = $uid;
	} else {

		$data['status'] = "danger";
		$data['statusMsg'] = "Could not register!".$error;
	}

	if (empty($data)) {
		deliver_response(200, "data not found", NULL);
	} else {
		deliver_response(200, "data found", $data);
	}	

} else {
	deliver_response(400, "invalid request", NULL);
}

?>
