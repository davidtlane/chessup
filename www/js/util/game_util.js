
function getIdx(r,c){
	return 8*r + c;
}

define(function () {
	return {

		getMsg: function (state, last, check, mayMove, playerCol, uid, opp) {
			var drawMsg = "";
			var oppCol = (playerCol=="w") ? "b" : "w";

			

			if (state=="-") return "Game Drawn.";
			if (state==playerCol) {
				if (last=="Resignation")
					return opp+" resigned!";
				else
					return "Checkmate! You won!";
			}
			if (state==oppCol) {
				if (last=="Resignation")
					return "You resigned!";
				else
					return "Checkmate! You lost!";
			}
			if (last=="DrawRefused") var drawMsg = "Draw refused. ";
			if (state=="D") return "Draw offered."
			if (check==1) return "Your king is under attack!";

			if (mayMove) {
				return drawMsg+"It's your turn!";
			} else {
				return drawMsg+"Waiting for "+opp+"'s move...";
			}

		},

		parseCastle: function (str,col) {
			if (str=='0-0') {
				if (col=='b') return 'Kf8-g8';
				else return 'Kf1-g1';
			}
			if (str=='0-0-0') {
				if (col=='b') return 'Kd8-c8';
				else return 'Kd1-c1';
			}
		},

		parseMove: function (str) {
			var lstr = "abcdefgh";
			var piece = str.slice(0,1);
			var col = [ lstr.indexOf(str.slice(1,2)), lstr.indexOf(str.slice(4,5)) ];
			var row = [ str.slice(2,3),str.slice(5,6) ];
			var take = (str.slice(3,4) == 'x') ? true : false;
			var from = 8*(row[0]-1) + col[0];
			var to   = 8*(row[1]-1) + col[1];
			return { piece:piece, from:from, to:to, take:take };
		},

		boardMap: function (idx) {
			var letters = ['a','b','c','d','e','f','g','h'];
			var row = 1 + Math.floor(idx/8);
			var col = letters[idx%8];
			return col+row;
		},

		getOptions: function (gBoard, idx, color, castling, last) {

			var side = gBoard[idx].slice(0,1);
			var pid = gBoard[idx].slice(1,2);

			var options = [], row = Math.floor(idx/8), col = idx%8;

			if (gBoard[idx]=="") return options;

			if (side!=color) return options;

			if (pid=="B"){
				var dirs = [ [1,1],[-1,1],[1,-1],[-1,-1] ];
				for (var i=0;i<dirs.length;i++){
					checkPath(dirs[i][0],dirs[i][1]);
				}
			}

			if (pid=="R"){
				var dirs = [ [1,0],[-1,0],[0,1],[0,-1] ];
				for (var i=0;i<dirs.length;i++){
					checkPath(dirs[i][0],dirs[i][1]);
				}
			}

			if (pid=="Q"){
				var dirs = [ [1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1] ];
				for (var i=0;i<dirs.length;i++){
					checkPath(dirs[i][0],dirs[i][1]);
				}
			}

			if (pid=="N"){
				var dirs = [ [1,2],[-1,2],[1,-2],[-1,-2],[2,1],[-2,1],[2,-1],[-2,-1] ];
				for (var i=0;i<dirs.length;i++){
					checkPath(dirs[i][0],dirs[i][1],true);
				}
			}

			if (pid=="K"){
				var dirs = [ [1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1] ];
				for (var i=0;i<dirs.length;i++){
					checkPath(dirs[i][0],dirs[i][1],true);
				}
				// check for castling
				if (color=="w") {
					if (idx==4) {
						if (castling.wcs==1 && gBoard[5]=='' && gBoard[6]=='' )
							options.push(6);
						if (castling.wcl==1 && gBoard[1]=='' && gBoard[2]=='' && gBoard[3]=='' )
							options.push(2);
					}
				}
				if (color=="b") {
					if (idx==60) {
						if (castling.bcs==1 && gBoard[61]=='' && gBoard[62]=='' )
							options.push(62);
						if (castling.bcl==1 && gBoard[57]=='' && gBoard[58]=='' && gBoard[59]=='' )
							options.push(58);
					}
				}
			}

			if (pid=="P"){

				if (color=="w") {
					if (row==1)
						checkPath(1,0,false,true);
					else
						checkPath(1,0,true);
					checkPawnTake(1,1);
					checkPawnTake(1,-1);
				} else {
					if (row==6)
						checkPath(-1,0,false,true);
					else
						checkPath(-1,0,true);
					checkPawnTake(-1,1);
					checkPawnTake(-1,-1);
				}

				// check for en passant
				if (last.slice(0,1)+last.slice(2,3)+last.slice(5,6)=='P75')
					if (color=="w" && row==4) {
						var lastCol = 'abcdefgh'.indexOf(last.slice(1,2));
						if (col==lastCol+1 || col==lastCol-1)
							options.push(getIdx(5,lastCol));
					}
				if (last.slice(0,1)+last.slice(2,3)+last.slice(5,6)=='P24')
					if (color=="b" && row==3) {
						var lastCol = 'abcdefgh'.indexOf(last.slice(1,2));
						if (col==lastCol+1 || col==lastCol-1)
							options.push(getIdx(2,lastCol));
					}

			}

			function checkPath(ri,ci,oneStep,twoStep){
				var c = col + ci; // increase column by ci
				var r = row + ri; // increase row by ri
				oneStep = oneStep || false;
				twoStep = twoStep || false;
				var s = 0;
				while ( c<=7&& c>=0 && r<=7 && r>=0 ) {
					var n = getIdx(r,c);
					if (gBoard[n]=="")
						options.push(n);
					else
						if (gBoard[n].slice(0,1)==color)
							break;
						else {
							if (pid!="P") options.push(n);
							break;
						}
					c=c+ci;
					r=r+ri;
					if (oneStep) break;
					if (twoStep) s++;
					if (s==2) break;
				}
			}

			function checkPawnTake(ri,ci){
				var c = col + ci; // increase column by ci
				var r = row + ri; // increase row by ri
				var n = getIdx(r,c);
				if ( c<=7&& c>=0 && r<=7 && r>=0 )
					if (gBoard[n]!="")
						if (gBoard[n].slice(0,1)!=color) options.push(n);
			}

			return options;
		}

	};
});


