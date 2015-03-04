
var colors = {w:"rgb(255,255,195)", b:"rgb(51,51,51)"};

var glyphs = {
	R:"tower", N:"knight", B:"bishop", K:"king", Q:"queen", P:"pawn"
};

var castling = {wcl:0, wcs:0, bcl:0, bcs:0};
var specialMoves = ['DrawOffered','DrawRefused','DrawAccepted','Resignation'];
var castleMoves = ['0-0','0-0-0'];


define(['util/game_util','util/global'], function ($U, global) {

	var board = {

		url: function () {
			return global.url +
			'get_game.php?member=' + localStorage.uid + '&gid=' + localStorage.gid;
		},

		setupBoard: function () {
		
			uid = localStorage.uid;
			gid = localStorage.gid;
			wht = localStorage.wht;

			playerCol = (uid==wht) ? "w" : "b";
			mayMove = false;

			if (uid==wht) {
				$("#you-name").addClass("white-piece");	
				$("#opp-name").addClass("black-piece");	
			} else {
				$("#you-name").addClass("black-piece");	
				$("#opp-name").addClass("white-piece");	
			}

			var w = $("#game-board").width();
			var h = Math.round(w/8)*8;
			$("#game-board").height(h);

			var sh = (w/8);    // square height
			var fs = 0.7 * sh; // font size
			var lh = 1.0 * sh; // line height

			var squares=[], classes = ["white","black"];

			for (var i=0;i<64;i++) {

				var sq = document.createElement("div");
				var row = 1 + Math.floor(i/8)%8;

				if (uid==wht)
					var j = 8 * (8-row) + (i%8);
				else
					var j = 8 * (row) - (i%8) - 1;

				$(sq).attr("id","sq-"+j);
				$(sq).addClass("square glyphicon");
				$(sq).css({"font-size":(fs+"px"), "line-height":(lh+"px")});
	
				if ((row-1)%2==0)
					$(sq).addClass(classes[i%2]);
				else
					$(sq).addClass(classes[(1+i)%2]);

				$("#game-board").append(sq);
				squares[i]=sq;
			}

			gameBoard = [];
			lastMove="";
			options=[];
		},

		drawPieces: function (json) {

			var curPlayer = json.data.curplyr;
			var lastPlayer = (curPlayer=="w") ? "b" : "w";

			lastMove = json.data.lastmove;
			gameBoard = json.data.board;

			var opp = json.data.p_opponent;
			var state = json.data.curstate;
			var check = (playerCol=="w") ? json.data.w_check : json.data.b_check;
			var gameOver = (['b','w','-'].indexOf(state)==-1) ? false : true;

			mayMove = ( (playerCol==curPlayer) && (!gameOver) ) ? true : false;
			
			if (mayMove) $("#nav-game").show();
			else $("#nav-game").hide();

			var msg = $U.getMsg(state, lastMove, check, mayMove, playerCol, uid, opp );

			castling.bcl = json.data.bcl;
			castling.bcs = json.data.bcs;
			castling.wcl = json.data.wcl;
			castling.wcs = json.data.wcs;

			$(".square").removeClass("lastmove");
			$('.square').attr('class', function(i,c) {
				return c.replace(/(^|\s)glyphicon-\S+/g, '');
			});

			if (lastMove) {
				if (specialMoves.indexOf(lastMove)==-1) {
					if (castleMoves.indexOf(lastMove)==-1)
						var lastRegularMove = $U.parseMove(lastMove);
					else
						var lastRegularMove = $U.parseMove($U.parseCastle(lastMove,lastPlayer));
					$("#sq-"+lastRegularMove.from).addClass("lastmove");
					$("#sq-"+lastRegularMove.to).addClass("lastmove");
				}
			}

			for (var i=0;i<64;i++){
				if (gameBoard[i]) {
					$("#sq-"+i).addClass("glyphicon-"+glyphs[gameBoard[i].slice(1,2)]);
					$("#sq-"+i).css({"color":colors[gameBoard[i].slice(0,1)]});
				}
			}
	
			var w_list = (playerCol=="w") ? "you" : "opp";
			var b_list = (playerCol=="w") ? "opp" : "you";

			$("#you-taken-list").html("");
			$("#opp-taken-list").html("");

			for (var i=0;i<json.data.b_taken.length;i++) {
				var li = document.createElement("li");
				var sp = document.createElement("span");
				var cp = glyphs[json.data.b_taken[i].slice(1,2)];
				$(li).addClass("taken right");
				$(sp).addClass("black-piece glyphicon glyphicon-"+cp);
				$(li).append(sp);
				$("#"+b_list+"-taken-list").append(li);
			}

			for (var i=0;i<json.data.w_taken.length;i++) {
				var li = document.createElement("li");
				var sp = document.createElement("span");
				var cp = glyphs[json.data.w_taken[i].slice(1,2)];
				$(li).addClass("taken right");
				$(sp).addClass("white-piece glyphicon glyphicon-"+cp);
				$(li).append(sp);
				$("#"+w_list+"-taken-list").append(li);
			}

			$("#opp-name").html(opp);
			$("#you-name").html(uid);
			$("#msg-text").html(msg);

			if (state=="D" && mayMove) $("#msg-btns").show();

		},

		updateBoard: function () {
			$.getJSON(board.url(), function(json) {
				if (json.data) {
					if (playerCol!=json.data.curplyr) {
						if (localStorage.currPage=="#board") setTimeout(board.updateBoard, 5000);
					} else {
						board.drawPieces(json);
					}
				} else {
					console.log("problem requesting game data");
					setTimeout(board.updateBoard, 5000);
				}
			});
		},

		synchUpdate: function (json) {
			board.drawPieces(json);
			board.updateBoard();
		},

		promotion: function (ev) {
			var btnVal = $(this).html();
			if (btnVal=="Queen") var prom = "Q";
			if (btnVal=="Rook") var prom = "R";
			if (btnVal=="Bishop") var prom = "B";
			if (btnVal=="Knight") var prom = "N";
			var move = ev.data.move + prom;
			var moveURL = board.url()+"&cmd="+move;
			options = [];
			$.getJSON(moveURL,board.synchUpdate);
		},

		firstMove: function (sq) {
			squareId1 = sq.attr("id");
			boardIndex1 = Number(squareId1.replace("sq-",""));
			gamePiece1 = gameBoard[boardIndex1];
			options = $U.getOptions(gameBoard, boardIndex1, playerCol, castling, lastMove);
			if (options.length==0) return
			else {
				sq.addClass("selected options");
				for (var i=0;i<options.length;i++){
					$("#sq-"+options[i]).addClass("options");
				}
			}
		},
		
		secondMove: function (sq) {
			gamePiece2 = gameBoard[boardIndex2];
			// regular move or take?
			if (gamePiece2=="")
				var con = "-";
			else
				var con = "x";
			var move = gamePiece1.slice(1,2) + 
								 $U.boardMap(boardIndex1) + 
								 con + 
								 $U.boardMap(boardIndex2);
			// pawn promotion?
			if ( (gamePiece1=="wP" && boardIndex2>55) || (gamePiece1=="bP" && boardIndex2<8) ) {
				$('#myModal').modal('show');
				$(".btn-prom").click({move:move}, board.promotion);
			} else {
				var moveURL = board.url()+"&cmd="+move;
				options = [];
				$.getJSON(moveURL, board.synchUpdate);
			}
		},
		
		makeMove: function (ev) {
			ev.preventDefault();
			if (!mayMove) return;
			$(".square").removeClass("selected options");
			if (options.length==0) board.firstMove($(this));
			else {
				squareId2 = $(this).attr("id");
				boardIndex2 = Number(squareId2.replace("sq-",""));
				if (boardIndex1==boardIndex2) {
					options=[];
					return;
				}
				if ( options.indexOf(boardIndex2)!=-1 ) board.secondMove($(this));
				else {
					board.firstMove($(this));
				}
			}
		},
		
		endGameMove: function (ev) {
			if (localStorage.currPage!="#board") return;
			if (!mayMove) return;
			var id = $(this).attr("id");
			if (id=="offerDrawBtn") var move = "draw?";
			if (id=="resignBtn") var move = "resigned";
			var moveURL = board.url()+"&cmd="+move;
			$.getJSON(moveURL, board.synchUpdate);
		},
		
		endGameMoveResponse: function (ev) {
			if (localStorage.currPage!="#board") return;
			if (!mayMove) return;
			var id = $(this).attr("id");
			if (id=="acceptBtn") var move = "accept_draw";
			if (id=="refuseBtn") var move = "refuse_draw";
			$("#msg-btns").hide();
			var moveURL = board.url()+"&cmd="+move;
			$.getJSON(moveURL, board.synchUpdate);
		}

	};
	
	return board;

});

