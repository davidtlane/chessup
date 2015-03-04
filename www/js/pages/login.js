
define(function () {

	var login = {

		loginSubmit : function(ev) {
			ev.preventDefault();
			var formData = $(this).serializeArray();
			var formObj = {};
			for (var i=0; i<formData.length; i++){
				formObj[JSON.stringify(formData[i]['name'])] = formData[i]['value'];
			}

			$.ajax({
				type: "POST",
				url: localStorage.url+'login.php',
				data: formObj,
				dataType: "json",
				success: function(json) {
					if (json.data['uid']) {
						localStorage.uid = json.data['uid'];
		//				updateContent("#home");
						window.location.hash="#home";
						window.location.reload();
					}	else {
						$("#loginFormMsg").html(json.data['statusMsg']).fadeIn();
					}
				},
				error: function(data){
					$("#loginFormMsg").html("Login failed.").fadeIn();
				}
			});

		}


	};
	
	return login;
	
});


