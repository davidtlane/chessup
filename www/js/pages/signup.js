
define( ['util/global'], function (global) {

	var signup = {

		signupSubmit: function(ev){
			ev.preventDefault();
			var formData = $(this).serializeArray();
			var formObj = {};
			for (var i=0; i<formData.length; i++){
				formObj[JSON.stringify(formData[i]['name'])] = formData[i]['value'];
			}

			$.ajax({
				type: "POST",
				url: global.url+'reg.php',
				data: formObj,
				dataType: "json",
				success: function(json) {
					if (json.data['uid']) {
						localStorage.uid = json.data['uid'];
		//				updateContent("#home");
						window.location.hash="#home";
						window.location.reload();
					}	else {
						$("#signupFormMsg").html(json.data['statusMsg']).fadeIn();
					}
				},
				error: function(data){
					$("#signupFormMsg").html("Sign up failed.").fadeIn();
				}
			});

		}
	

	};
	
	return signup;
	
});


