<?php

include ('webservice.php');

if ($_POST){

	include ('db_conn.php');

	$uid = mysqli_real_escape_string($conn, $_POST['"uid"']);
	$pwd = md5($secret_string.md5($_POST['"pwd"']));

	$sql = "SELECT id,username,pwrd FROM membership
					WHERE username='$uid'
					AND pwrd='$pwd'";

	$res = mysqli_query($conn, $sql);

	$data = array();

	list($memberID) = mysqli_fetch_row($res);

	if ($memberID >= 1) {

		$data['status'] = "success";
		$data['statusMsg'] = "Logged in.";
		$data['uid'] = $uid;

	} else {

		$data['status'] = "danger";
		$data['statusMsg'] = "Failed To Login.";

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
