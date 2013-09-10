"use strict";

$(function() {
	// monitor href clicks
	$('a[href]').click(function(event) {		
		list_contents(this.name);		
	});
});

var g_cloud_count = 0;

function list_contents(cloud_name) {
	/*
	var popup = window.open("about:blank", "dummy_window", "height=50, width=50", true);	
	setTimeout(function() {
    	if(!popup || popup.outerHeight === 0) {
    		alert("Popup Blocker is enabled! Please unblock Popup for this site");
    		return;
        } else {
        	popup.close()        	
        }
    }, 5);
	*/
    if(g_cloud_count < 2) {
	    var parent = document.getElementById('div_cloud_display');		        
		switch(cloud_name) {
			case "googledrive":					
						load_google_drive(cloud_name, parent);
						break;
			case "dropbox":					
						load_dropbox(cloud_name, parent);
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
	} else {
		alert('Error: Only two cloud storage sync supported !!!');
		return;
	}
}

function get_collapse_unique_target_id(cloud_name, folder_name, count) {
	return 'target_' + cloud_name + '_' + folder_name + "_" + count;
}

function create_navigation_list(cloud_name, username, parent) {
	if(document.getElementById('nav_' + cloud_name)) {
		alert("Error: " + cloud_name.toUpperCase() + " already exist !!!");
		return;
	}
	g_cloud_count++;	
	create_div('nav_' + cloud_name, 'span5', '', '', parent);
	var nav_parent = document.getElementById('nav_' + cloud_name);
	create_unordered_list('ul_' + cloud_name, 'nav nav-list', nav_parent);
	var ul_parent = document.getElementById('ul_' + cloud_name);
	var header = cloud_name;
	if(username) header = header + " ("+ username + ")";
	create_list('', 'nav-header', header, ul_parent);
	create_list('', 'divider', '', ul_parent);	
	create_div('folder_' + cloud_name, '', '', '', ul_parent);
}

function create_unordered_list(id, classname, parent) {
	var elem = document.createElement("ul");
	elem.setAttribute('id', id);
	elem.setAttribute('class', classname);
	parent.appendChild(elem);
}

function create_list(id, classname, text, parent) {
	var li = document.createElement("li");
	if(id) li.setAttribute('id', id);
	li.setAttribute('class', classname);
	if(text) li.innerText = text.toUpperCase();
	parent.appendChild(li);
}

function create_anchor(name, href, text, parent) {
	var a = document.createElement("a");
	a.setAttribute('name', name);
	a.setAttribute('href', href);
	a.innerText = text.toUpperCase();
	parent.appendChild(a);
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
	if(id) elem.id = id;
	if(classname) elem.className = classname;
	if(text)  elem.textContent = text;
	if(style) elem.setAttribute('style', style);
	parent.appendChild(elem);	
}

function create_icon(id, target, parent) {
	var html_icon = '<i style="margin-top:0.1cm;" class="icon-plus" data-toggle="collapse" data-target="#' + target  + '" id="img_' + id + '"></i>';
	parent.insertAdjacentHTML('beforeend', html_icon);
}

function create_text(text, parent) {
	var el = document.createTextNode(text);
  	parent.appendChild(el);
}

function quota_string(size) {
	if(size < 1024) { 
		return size + " Bytes";
	} else if(size < (1024 * 1024)) {
		return Math.round(size/(1024)) + " Bytes";
	} else if(size < (1024 * 1024 * 1024)) {
		return Math.round(size/(1024 * 1024)) + " MB";
	} else if(size < (1024 * 1024 * 1024 * 1024)) {
		return Math.round(size/(1024 * 1024 * 1024)) + " GB";
	} else {
		"unknown";
	}
}

function prepare_quota_heading(user_name, used_quota, quota) {
	return user_name + " - " + quota_string(used_quota) + " of " + quota_string(quota) + " used";
}