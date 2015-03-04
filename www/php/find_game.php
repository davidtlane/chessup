<?php

include('db_conn.php');
include('webservice.php');
include('util.php');

$uid = $_GET['uid'];

if (isset($uid)) {
	
	$uid = mysqli_real_escape_string($conn, $uid);
	
	// check if user is already on the waiting list
	$sql = "SELECT username FROM waiting_area WHERE username='$uid'";
	$res = mysqli_query($conn, $sql);
	$row = mysqli_fetch_array($res);

	// add user to the list if not already on it
	if(!$row['username']) {
		$sql = "INSERT INTO waiting_area (username) VALUES ('$uid')";
		mysqli_query($conn, $sql);
	}

	// check if another user is on the waiting list
	$sql = "SELECT username FROM waiting_area WHERE username<>'$uid' order by id";
	$res = mysqli_query($conn, $sql);
	$row = mysqli_fetch_array($res);

	if (!$row['username']){
		// if no other user...
		$statusMsg = "waiting for a game partner...";
		$found = false;
	} else {
		// if found another user...
		$opp = $row['username'];
		$statusMsg = "partner found...".$opp;
		$found = true;

		// create game
		$white = $uid;
		$black = $opp;
		$gid = dbCreateGame($white, $black, $conn);

		// remove both from waiting list now that game has been created
		$sql = "DELETE FROM waiting_area WHERE
		( username='$uid' OR username='$opp' )";
		mysqli_query($conn, $sql);

	}
	
}

// process client request (via URL)

$data = array();
$data['msg'] = $statusMsg;
$data['found'] = $found;
$data['white'] = $white;
$data['gid'] = $gid;

if (!empty($uid)) {

	if (empty($data)) {
		deliver_response(200, "data not found", NULL);
	} else {
		deliver_response(200, "data found", $data);
	}

} else {
	deliver_response(400, "invalid request", NULL);
}

?>
