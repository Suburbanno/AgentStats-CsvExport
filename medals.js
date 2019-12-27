const got = require('got');
const fs = require('fs');
const path = require('path');
const os = require('os');

const filename = path.join(__dirname, 'medals.csv');

var options = {
	headers: {
		"AS-Key": "key-here"
	},
	responseType: 'json'
};

function getArray(obj) {
	var keys = Object.keys(obj);
	var arr = [];
	
	for (var i = 0; i < keys.length; i++) {
		var o = obj[keys[i]];
		
		o.name = keys[i];
		arr.push(o);
	}
	
	return arr;
}

got('https://api.agent-stats.com/medals', options)
.then(r => {
	var data = JSON.parse(r.body);
	delete data.ap;
	
	var arr = getArray(data);
	var csv_arr = [];
	
	var keys = ['name'];
	
	for (var i = 0; i < arr.length; i++) {
		var k = Object.keys(arr[i]);
		
		for (var j = 0; j < k.length; j++) {
			if (keys.indexOf(k[j]) == -1)
				keys.push(k[j]);
		}
	}
	
	var line_header = [];
	
	for (var j = 0; j < keys.length; j++) {
		var el = ''+keys[j];
		
		if (!el)
			line_header.push('');
		else if (el.indexOf(';') != -1 || el.indexOf('"') != -1)
			line_header.push('"' + el + '"');
		else
			line_header.push(el);
	}
	
	csv_arr.push(line_header.join(';'));
	
	for (var i = 0; i < arr.length; i++) {
		var o = arr[i];
		var line = [];
		
		for (var j = 0; j < keys.length; j++) {
			var el = ''+o[keys[j]];
			
			if (!el)
				line.push('');
			else if (el.indexOf(';') != -1 || el.indexOf('"') != -1)
				line.push('"' + el + '"');
			else
				line.push(el);
		}
		
		csv_arr.push(line.join(';'));
	}
	
	fs.writeFileSync(filename, csv_arr.join('\n'));
})
.catch(e => console.log(e));