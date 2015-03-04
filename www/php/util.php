<?php

/*
 ts_start: timestamp of starting date (secs)
 ts_last: timestamp of last move (secs)
 white: name of white player
 black: name of black player
 curmove: number of current move (start at 0)
 curplyr: color of current player (w or b)
 curstate: state of game (w/b=white/black won,-=draw,D=draw offered,?=open)
 wcs: white may castle short
 wcl: white may castle long
 bcs, bcl: dito for black
 w2spm: 2-step pawn move of white (x or a-h)
 b2spm: dito for black
 lastmove: last move in full notation (e.g. Pd2-d4 or x)
 lastkill: chessman captured in last move with board index (e.g. wP08 or x)
 oscf: old short castling flag (only set by king/rook move)
 olcf: dito for long castling
 board: chess board array (0=a1,63=h8) with e.g. 'bP', 'wQ' or ''

 p_maymove: whether it's player's turn (always 0 if user is not playing)
 p_color: player color (w=white,b=black or empty if not playing)
 p_opponent: name of opponent (based on player color, empty if not playing)
*/

function dbLoadGame($gid, $uid, $cmd, $cmdres, $conn) {

	$sql = "SELECT *
					FROM current_games
					WHERE gameid = '$gid'
					LIMIT 1";

	$res = mysqli_query($conn, $sql);
	$game = mysqli_fetch_array($res);

	$game['board'] = explode(",",$game['board']);
	$game['w_taken'] = ($game['w_taken']) ? explode(",",$game['w_taken']) : array(); 
	$game['b_taken'] = ($game['b_taken']) ? explode(",",$game['b_taken']) : array();

	$game['last_cmd'] = $cmd;
	$game['last_cmd_res'] = $cmdres;

	$game['p_color'] = ($game['white']==$uid) ? "w" : "b";
	$game['p_opponent'] = ($game['p_color']=="w") ? $game['black'] : $game['white'];
	$game['p_maymove'] = ($game['p_color']==$game['curplyr']) ? 1 : 0;

	return $game;

}

function dbSaveGame($game, $gid, $conn) {

	$now = time();
	$curmove = $game['curmove'];
	$curplyr = $game['curplyr'];
	$curstate = $game['curstate'];
	$wcs = $game['wcs'];
	$wcl = $game['wcl'];
	$bcs = $game['bcs'];
	$bcl = $game['bcl'];
	$w2spm = $game['w2spm'];
	$b2spm = $game['b2spm'];
	$lastMove = $game['lastmove'];
	$lastkill = $game['lastkill'];
	$oscf = $game['oscf'];
	$olcf = $game['olcf'];
	$w_check = $game['w_check'];
	$b_check = $game['b_check'];
	$board = implode( ",", $game['board'] );
	$w_taken = implode( ",", $game['w_taken'] );
	$b_taken = implode( ",", $game['b_taken'] );

	$sql = "UPDATE current_games SET
					curmove='$curmove', curplyr='$curplyr', curstate='$curstate',
					wcs='$wcs', wcl='$wcl', bcs='$bcs', bcl='$bcl',
					w2spm='$w2spm', b2spm='$b2spm',
					lastmove='$lastMove', lastkill='$lastkill',
					oscf='$oscf', olcf='$olcf',
					board='$board',
					ts_last='$now',
					w_check='$w_check', b_check='$b_check',
					w_taken='$w_taken', b_taken='$b_taken'
					WHERE gameid='$gid'";

	mysqli_query($conn, $sql);

}

function dbCreateGame($white, $black, $conn) {

	// Add this game to the ongoing games table in the database
	$now = time();
	$gid = $now."-".$white."-".$black;
  $sql = "INSERT INTO current_games 
					(gameid,white,black,ts_start)
  				VALUES
  				('$gid','$white', '$black','$now')";

  mysqli_query($conn, $sql);

	// Initial game parameters
	$game = array();

	$game['curmove'] = 0;
	$game['curplyr'] = 'w';
	$game['curstate'] = '?';
	$game['wcs'] = 1;
	$game['wcl'] = 1;
	$game['bcs'] = 1;
	$game['bcl'] = 1;
	$game['w2spm'] = 'x';
	$game['b2spm'] = 'x';
	$game['lastmove'] = 'x';
	$game['lastkill'] = 'x';
	$game['oscf'] = 'x';
	$game['olcf'] = 'x';
	$game['w_taken'] = array();
	$game['b_taken'] = array();
	$game['board'] = array(
		'wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR', // a1 - h1
		'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', // a2 - h2
		'', '', '', '', '', '', '', '',
		'', '', '', '', '', '', '', '',
		'', '', '', '', '', '', '', '',
		'', '', '', '', '', '', '', '',
		'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',  // a7 - h7
		'bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'); // a8 - h8

	dbSaveGame($game, $gid, $conn);

	return $gid;
}



?>
