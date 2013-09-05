"use strict";

$(function() {
	// monitor href clicks
	$('a[href]').click(function(event) {
		list_contents(this.name);
	});
});

function list_contents(cloud_name) {
	switch(cloud_name) {
		case "googledrive": 
					load_google_drive();
					break;
		case "dropbox": 
					alert("Still not implemented");
					break;
		case "copy": 
					alert("Still not implemented");
					break;
		case "icloud": 
					alert("Still not implemented");
					break;
		default:
					alert("Not supported !!!");					
	}
}

function handle_google_drive_auth_result(resp) {
	if (resp && !resp.error) { 			 		
 		console.log("rSync: Authorization complete !!!")
 	} else {
 		console.log("rSync: Calling authorization popup !!!")
 		authorize_google_drive(false);
 	}
 	list_google_drive_contents();
}

function authorize_google_drive(immediate) {
	var user_id = '';
	gapi.auth.authorize({
							  	client_id: '175339823669-kj2bv8dljiestf0nvp4dfm2f77855ldb.apps.googleusercontent.com',
							  	scope: [
										  	'https://www.googleapis.com/auth/drive.install',
										  	'https://www.googleapis.com/auth/drive.file',
										  	'openid'
							  			],
							  	user_id: user_id,
							  	immediate: immediate
							}, 
							handle_google_drive_auth_result);
}

function load_google_drive() {	
	gapi.load('auth:client,drive-realtime,drive-share', function() {
		authorize_google_drive(true); // without pop up
	});
}

function handle_google_drive_file_list(files) {
	for (var i=0;i<files.length;i++) {
		console.log(files[i].title);
	}	
}

function list_google_drive_contents() {
	gapi.client.load('drive', 'v2', function() {
		function read_files(next_page, page_token, files) {				
			var request = gapi.client.drive.files.list(page_token);
			request.execute(function(resp) {
				if(resp.items)					
					files 	= files.concat(resp.items);				
				if(resp.nextPageToken) {
					read_files(resp.nextPageToken, {'pageToken': resp.nextPageToken}, files);
				} else {
					handle_google_drive_file_list(files);
				}				
			});
		}
		read_files(null, null, []);
	});
}