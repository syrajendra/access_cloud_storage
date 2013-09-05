"use strict";

$(function() {
	// monitor href clicks
	$('a[href]').click(function(event) {
		list_contents(this.name);
	});
	
	$(".icon-minus, .icon-plus").on('click', function() {
	    $(this).toggleClass("icon-minus icon-plus");
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
					  	'https://www.googleapis.com/auth/drive',
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

function handle_google_drive_file_list(list) {
	var folder_div = document.getElementById('folder_list');	
	
	for (var i=0;i<list.length;i++) {
		console.log(list[i].title);
		console.log(list[i].mimeType);
		console.log(list[i].id);
		folder_div.insertAdjacentHTML('beforeend', '<i class="icon-plus" data-toggle="collapse" data-target="' + list[i].title +'"></i>')
		var elem = document.createElement('input');
		elem.setAttribute('type', 'button');
    	elem.setAttribute('value', list[i].title);
    	elem.setAttribute('name', list[i].title);
    	elem.setAttribute('class', 'btn btn-mini');
		folder_div.appendChild(elem);
		folder_div.insertAdjacentHTML('beforeend', '<div id="' + list[i].title + '" class="collapse"> ' + "File list..." + '</div>')
	}		
}

function list_google_drive_contents() {
	gapi.client.load('drive', 'v2', function() {
		function read_files(next_page, page_token, list) {				
			var request = gapi.client.drive.files.list(page_token);
			console.log(page_token);
			request.execute(function(resp) {				
				if(resp.items) {
					list 	= list.concat(resp.items);				
				}
				if(resp.nextPageToken) {
					read_files(resp.nextPageToken, {'pageToken': resp.nextPageToken}, list);
				} else {
					handle_google_drive_file_list(list);
				}				
			});
		}
		var query = "'root' in parents";
		read_files(null, {'q' : query}, []);
	});
}