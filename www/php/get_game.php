<?php

include ('db_conn.php');
include ('util.php');
include ('webservice.php');

$uid = mysqli_real_escape_string($conn, $_GET['member']);
$gid = mysqli_real_escape_string($conn, $_GET['gid']);

$cmd = '';
$cmdres = 'command not found';

if (!empty($_GET['cmd'])) {

		include 'chess_logic.php';

		// load game
    $game = dbLoadGame($gid, $uid, $cmd, $cmdres, $conn);
  
		// get command
    $cmd = $_GET['cmd'];

		// handle move
		$res = handleMove($game, $uid, $cmd, $conn);
		
		if (is_array($res)){

			list($game, $cmdres) = $res;

			// Save game if a new game was returned
			dbSaveGame($game, $gid, $conn);

		} else {
		
			$cmdres = $res;
			
		}

}

// load game
$game = dbLoadGame($gid, $uid, $cmd, $cmdres, $conn);


// process client request (via URL)

if (!empty($_GET['gid'])){

	if (empty($game)) {
		deliver_response(200, "game not found", NULL);
	} else {
		deliver_response(200, "game found", $game);
	}

} else {
	deliver_response(400, "invalid request", NULL);
}


?>

