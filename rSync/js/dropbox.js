"use strict";

var g_dropbox_count = 0;
var g_cloud_name = '';

function list_dropbox_contents(folder, client, parent) {
	client.readdir(folder, function(error, entries) {
  		if (error) {
    		console.error("Failed to read dir : " + error);
    		return;
  		}
  		if(entries.length) {
	  		console.log(entries);
	  		var path = '';
	  		for(var i=0; i<entries.length; i++) {
	  			if(folder == "/") 
	  				path = folder + entries[i];
	  			else
	  				path = folder + "/" + entries[i];

	  			client.stat(path, null, function(error, stat, array) {
	  				if (error) {
	    				console.error("Failed to read dir : " + error);
	    				return;
	  				}
	  				if(stat) {
	  					var f_name = stat.path.substring(stat.path.lastIndexOf("/")+1, stat.path.length);
	  					if(stat.isFolder) {
	  						console.log("Folder : " + stat.path);
	  						console.log(stat);
	  						if('/Apps' == stat.path) return;
	  						if('/Public' == stat.path) return;  						
	  						g_dropbox_count++;  								
							var target_id = get_collapse_unique_target_id(g_cloud_name, f_name, g_dropbox_count);
							create_icon(f_name, target_id, parent);
							create_radio_button(f_name, 'radio_btn', 'margin-left:0.1cm;', parent);			
							create_div(target_id, "collapse", "", 'margin-left:1cm;', parent);
							var parent_id = document.getElementById(target_id);
	  						list_dropbox_contents(stat.path, client, parent_id);
	  					} else {
	  						console.log("File : " + stat.path);
	  						create_radio_button(f_name, 'radio_btn', 'margin-left:0.5cm;', parent);
	  					}
	  				}  				
	  			});  
	  		}
  		} else {
  			create_text('Empty folder !!!', parent);
  		}
	});
}

function load_dropbox(cloud_name, parent) {
	g_cloud_name = cloud_name;
	//Dropbox.AuthDriver.Popup.oauthReceiver();
	var client = new Dropbox.Client({ key: "0uas9683o65och3" });
	console.log(client.isAuthenticated());
	if(!client.isAuthenticated()) {
		client.authDriver(new Dropbox.AuthDriver.Redirect({rememberUser:true, redirectUrl:'https://115.99.249.252/rSync/index.html'}));
		client.authenticate(function (error, data) {
			if(error) {
				console.error('Error: Failed to get access ' + error);
				return;
			} 
			client.getAccountInfo(function(error, accountInfo) {
  				if (error) {
    				console.error('Error: Failed to get account info : ' + error);
    				return;
  				} 
  				create_navigation_list(cloud_name, accountInfo.name, parent);
  				var folder_div = document.getElementById('folder_' + cloud_name);
  				list_dropbox_contents("/", client, folder_div);					
			});
		});
		console.log(client);	 
	 }	
}
