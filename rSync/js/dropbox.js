"use strict";

function load_dropbox(cloud_name, parent) {
	//Dropbox.AuthDriver.Popup.oauthReceiver();
	var client = new Dropbox.Client({ key: "0uas9683o65och3" });
	console.log(client.isAuthenticated());
	if(!client.isAuthenticated()) {
		client.authDriver(new Dropbox.AuthDriver.Redirect({rememberUser:true, redirectUrl:'https://115.99.249.252/rSync/index.html'}));
		client.authenticate(function (error, data) {
			if(error) {
				alert('Error: Failed to get access ' + error);
				return;
			} else {
				client.getAccountInfo(function(error, accountInfo) {
  					if (error) {
    					return alert('Error: Failed to get account info : ' + error);
  					} else  {
  						create_navigation_list(cloud_name, accountInfo.name, parent);
  					}  					
				});				
			}
		});
		console.log(client);	 
	 }	
}
