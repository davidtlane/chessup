
define( ['util/global'], function (global) {

	var home = {

		url: function () {
			return global.url + 'get_current_games.php?uid=' + localStorage.uid;
		},
		
		getCurrentGames: function (json) {
			if (json.data.games) {
				var cm = json.data.games;
				var nTotal = cm.length, nCurrent = 0, nActive = 0, nFinished=0;
				currGids = [], currWhts = [], finGids = [], finWhts = [];
				var currGamesTable = "", finGamesTable = "";
				for (var i=0;i<nTotal;i++){
					if (cm[i].gameover) {
						nFinished++;
						if (cm[i].curstate=="-") {
							var turn = "Tied";
							var btnClass = "'btn btn-default btn-block btn-sm'";
						} else {
							if (cm[i].curstate==cm[i].urcolor) {
								var turn = "Won";
								var btnClass = "'btn btn-info btn-block btn-sm'";
							} else {
								var turn = "Lost";
								var btnClass = "'btn btn-danger btn-block btn-sm'";
							}
						}
					turn = "<button href='#board' class="+btnClass+">"+turn+"</button>";
					finGamesTable += "<tr><td>"+cm[i].opp+"</td><td>"+turn+"</td></tr>";
					finGids.push(cm[i].gameid);
					finWhts.push(cm[i].white);
					} else {
						nCurrent++;
						if (cm[i].urturn) {
							nActive++;
							var turn = "Your move";
							var btnClass = "'btn btn-success btn-block btn-sm'"
						} else {
							var turn = "Their move";
							var btnClass="'btn btn-warning btn-block btn-sm'"
						}
					turn = "<button href='#board' class="+btnClass+">"+turn+"</button>";
					currGamesTable += "<tr><td>"+cm[i].opp+"</td><td>"+turn+"</td></tr>";
					currGids.push(cm[i].gameid);
					currWhts.push(cm[i].white);
					}
				}

				$("#currGamesTable").html(currGamesTable);
				$("#finGamesTable").html(finGamesTable);

				if (nCurrent>0) {
					var plural = (nCurrent==1) ? "" : "s";
					$("#currGamesMsg").html(nCurrent+" ongoing game"+plural);
				} else {
					$("#currGamesMsg").html("");
				}

				if (nActive>0) {
					$("#activeGames").html(nActive);
				} else {
					$("#activeGames").html("");
				}

				if (nFinished>0) {
					var plural = (nFinished==1) ? "" : "s";
					$("#finGamesMsg").html(nFinished+" finished game"+plural);
				} else {
					$("#finGamesMsg").html("");
				}
/*
				$("#currGamesTable td").on("click", function() {
					var row_index = $(this).parent().index();
					localStorage.gid = currGids[row_index];
					localStorage.wht = currWhts[row_index];
				});

				$("#finGamesTable td").on("click", function() {
					var row_index = $(this).parent().index();
					localStorage.gid = finGids[row_index];
					localStorage.wht = finWhts[row_index];
				});
*/
				// make new request after n seconds
				if (localStorage.currPage=="#home") setTimeout( home.autoGetCurrentGames, 5000 );

			} else {
				$("#currGamesMsg").html("You have no current games. Find a game and start playing!");
				$("#finGamesMsg").html("");
				$("#activeGames").html("");

				// make new request after n seconds
				if (localStorage.currPage=="#home") setTimeout( home.autoGetCurrentGames, 5000 );

			}

		},

		onCurrGamesTableSelect: function (el) {
			var row_index = el.parent().index();
			localStorage.gid = currGids[row_index];
			localStorage.wht = currWhts[row_index];
		},

		onFinGamesTableSelect: function (el) {
			var row_index = el.parent().index();
			localStorage.gid = finGids[row_index];
			localStorage.wht = finWhts[row_index];
		},

		autoGetCurrentGames: function () {
			$.getJSON(home.url(), home.getCurrentGames);
		},

		findGame: function (ev) {
			ev.preventDefault();
			var formData = "uid="+localStorage.uid;
			var findGameURL = global.url + 'find_game.php?' + formData;
			$.getJSON(findGameURL, function(json) {
				if (json.data) {
					$("#findGameFormMsg").html(json.data['msg']).fadeIn();
					if (json.data['found']) {
						localStorage.gid = json.data['gid'];
						localStorage.wht = json.data['white'];
						window.location.hash="#board";
						window.location.reload();
					}
				}	else {
					$("#findGameFormMsg").html("Error finding partner - please try again.").fadeIn();
				}
			});
		}

	};
	
	return home;
	
});


