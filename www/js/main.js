
requirejs.config({
	baseUrl: 'js/lib',
	paths: {
		util: '../util',
		page: '../pages'
	},
	shim: {
		bootstrap: { deps:['jquery'] }
	}
});


(function onDeviceReady () {

	require(
		['jquery', 'bootstrap', 'page/login', 'page/signup', 'page/home', 'page/board'],
		startApp);

})();

function startApp($,bootstrap,login,signup,home,board) {

	$(document).on('click','#menu',function(ev) {
		if ( $(ev.target).is('a') ) $(this).slideToggle();
		if ( $(ev.target).is('button') ) $(this).slideToggle();
	});

	$(document).on("click", "#menu-btn", function(ev){
		$("#menu").slideToggle();
	});

	$(document).on("click", "#nav-game", function(ev){
		$("#nav-game ul").slideToggle();
	});

	$(document).on("click", "a", function(ev){
		var href = $(this).attr("href");
		if (href) {
			var newHash = href;
			updateContent(newHash);
		}
	});

	function loggedOut() {
		$("#nav-user").html("Not logged in.");
		$("#nav-login, #nav-signup").show();
		$("#nav-logout, #nav-home, #nav-game").hide();
	}

	function loggedInHome() {
		$("#nav-user").html(localStorage.uid);
		$("#nav-logout, #nav-home").show();
		$("#nav-login, #nav-signup, #nav-game").hide();
	}

	function loggedInGame() {
		$("#nav-user").html(localStorage.uid);
		$("#nav-home, #nav-game").show();
		$("#nav-login, #nav-signup, #nav-logout").hide();
	}

	function hidePopUps() {
		$("#msg-btns, .alert").hide();
	}

	function loadContent(hash) {
		$("#content").html($(hash).html());
	}

	if (window.location.hash) {
		updateContent(window.location.hash);
	} else {
		if (localStorage.uid) {
			window.location.hash="#home";
			updateContent("#home");
		} else {
			window.location.hash="#login";
			updateContent("#login");
		}
	}
	
	$(document).on("submit", "form#loginForm", login.loginSubmit);
	$(document).on("submit", "form#signupForm", signup.signupSubmit);

	$(document).on("submit", "form#findGameForm", home.findGame);
	$(document).on("click", "#currGamesTable td", function(ev){
		home.onCurrGamesTableSelect($(this));
		window.location.hash="#board";
		updateContent("#board");
	});
	$(document).on("click", "#finGamesTable td", function(ev){
		home.onFinGamesTableSelect($(this));
		window.location.hash="#board";
		updateContent("#board");
	});

	$(document).on("click", ".square", board.makeMove);
	$(document).on("click", ".spcMove", board.endGameMove);
	$(document).on("click", ".respBtn", board.endGameMoveResponse);

	function updateContent(hash) {

		localStorage.currPage = hash;

		if ( hash=="#login" )
			if (localStorage.uid) localStorage.removeItem("uid");

		if ( hash=="#home" ) {
			if (localStorage.gid) localStorage.removeItem("gid");
			if (localStorage.wht) localStorage.removeItem("wht");
		}

		if (localStorage.uid) {
			if (localStorage.gid)
				loggedInGame();
			else
				loggedInHome();
		} else {
			loggedOut();
		}

		loadContent(hash);

		hidePopUps();

		if ( hash=="#home" ) {
			home.autoGetCurrentGames();
		}

		if ( hash=="#board" ) {
			board.setupBoard();
			$.getJSON(board.url(), board.synchUpdate);
		}

	}

}

