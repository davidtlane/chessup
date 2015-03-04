<?php

include ('webservice.php');

if ($_GET['uid']) {

	include ('db_conn.php');

	$uid = mysqli_real_escape_string($conn, $_GET['uid']);

	$sql = "SELECT ts_start, ts_last, gameid, white, black, curplyr, curstate
					FROM current_games
					WHERE ( white='$uid' OR black='$uid' )";

	$res = mysqli_query($conn, $sql);

	$games = array();
	$i = 0;
	while ($row = mysqli_fetch_array($res)) {

		$white = $row['white'];
		$black = $row['black'];
		$gameid = $row['gameid'];
		$ts_start = $row['ts_start'];
		$ts_last = $row['ts_last'];
		$curplyr = $row['curplyr'];
		$curstate = $row['curstate'];

		$urcolor = ($uid==$white) ? "w" : "b";
		$opp = ($uid==$white) ? $black : $white;
		$urturn = ($urcolor==$curplyr) ? true : false;
		$gameover = ($curstate=="w" || $curstate=="b" || $curstate=="-") ? true : false;

		$game = array();
		$game['start'] = $ts_start;
		$game['last'] = $ts_last;
		$game['gameid'] = $gameid;
		$game['white'] = $white;
		$game['black'] = $black;
		$game['curplyr'] = $curplyr;
		$game['curstate'] = $curstate;

		$game['urcolor'] = $urcolor;
		$game['opp'] = $opp;
		$game['urturn'] = $urturn;
		$game['gameover'] = $gameover;

		$games[$i] = $game;
		$i++;
	}	

	if (!empty($game)) {
		$data['statusMsg'] = "found games";
		$data['games'] = $games;
	} else {
		$data['sql'] = $sql;
		$data['statusMsg'] = "found no games";
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


