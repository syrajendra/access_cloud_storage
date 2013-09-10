"use strict";

$(function() {
	// monitor href clicks
	$('a[href]').click(function(event) {
		list_contents(this.name);
		//list_contents_dummy(this.name);
	});
});

function toggle_init () {
	$(".icon-minus, .icon-plus").on('click', function(event) {
	    $(this).toggleClass("icon-minus icon-plus");	     
	});
}

/* Function  for testing purpose */
function list_contents_dummy() {
	var list = [
		{'title' : 'One', 'mimeType' : 'application/vnd.google-apps.folder', 'id' : '1'},
		{'title' : 'Two', 'mimeType' : 'application/vnd.google-apps.folder', 'id' : '2'},
		{'title' : 'Three', 'mimeType' : 'application/vnd.google-apps.file', 'id' : '3'},
		{'title' : 'Four', 'mimeType' : 'application/vnd.google-apps.folder', 'id' : '4'}
	];
	handle_google_drive_file_list(list);
}

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
 	var folder_div = document.getElementById('folder_list');
 	list_google_drive_contents('root', folder_div);
 	toggle_init();
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

function create_radio_button(label, name, radio_style, parent) {
	var elem = document.createElement('input');
	elem.setAttribute('type', 'radio');
	elem.setAttribute('name', name);
	elem.setAttribute('style', radio_style);
	var lab = document.createElement('label');
	lab.setAttribute('class', 'radio inline')
	var text = document.createTextNode(label);
	lab.appendChild(text);	    	
	parent.appendChild(elem);
	parent.appendChild(lab);
	parent.appendChild(document.createElement('br'));
}

function create_button_mini(name, value, parent) {
	var elem = document.createElement('input');
	elem.setAttribute('type', 'button');
	elem.setAttribute('value', value);
	elem.setAttribute('name', name);
	elem.setAttribute('class', 'btn btn-mini');
	parent.appendChild(elem);			
}

function create_div(id, classname, text, style, parent) {
	var elem = document.createElement('div');
	elem.id = id;
	elem.className = classname;
	elem.textContent = text;
	elem.setAttribute('style', style);
	parent.appendChild(elem);	
}

function create_icon(id, target, parent) {
	var html_icon = '<i style="margin-top:0.1cm;" class="icon-plus" data-toggle="collapse" data-target="#' + target  + '" id="img_' + id + '"></i>';
	parent.insertAdjacentHTML('beforeend', html_icon);
}

var g_count = 0;
function get_collapse_unique_target_id(folder_name) {
	g_count++;
	var target_id = 'target_' + folder_name + "_" + g_count;
	return target_id;
}

function handle_google_drive_file_list(list, parent) {		
	for (var i=0;i<list.length;i++) {
		console.log(list[i].title);
		console.log(list[i].mimeType);
		console.log(list[i].id);		
		if("application/vnd.google-apps.folder" == list[i].mimeType) {			
			var target_id = get_collapse_unique_target_id(list[i].title);
			create_icon(list[i].title, target_id, parent);
			create_radio_button(list[i].title, 'radio_btn', 'margin-left:0.1cm;', parent);			
			create_div(target_id, "collapse", "", 'margin-left:1.4cm;', parent);
			var parent_id = document.getElementById(target_id);
			list_google_drive_contents(list[i].id, parent_id);
		} else {
			create_radio_button(list[i].title, 'radio_btn', 'margin-left:0.5cm;', parent);
		}
	}		
}

function list_google_drive_contents(id, parent) {
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
					handle_google_drive_file_list(list, parent);
				}				
			});
		}
		var query = "'" + id + "' in parents";
		read_files(null, {'q' : query}, []);
	});
}