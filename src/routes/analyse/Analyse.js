import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Analyse.scss';
var Dropzone = require('react-dropzone');

var headers = {
	"app_id"          : "bad9ee05",
	"app_key"         : "c9cebb99d2ac13ea06dbc541eb151158"
};


var race="klfklmkvlkmkgtp";

function callApi(file,callback)
{
  var url = "http://api.kairos.com/detect";
  var payload  = { "image" : file };

	console.log(file);
	var race = {
		'type' : '',
		'coef' : 0
	};
  // make request
	$.ajax(url, {
     headers  : headers,
      type: "POST",
      data: JSON.stringify(payload),
      dataType: "text"
  }).done(function(response){
		var result = JSON.parse(response);
		if(result.images[0].faces[0].attributes)
		{

			for(var key in result.images[0].faces[0].attributes)
			{
				if(result.images[0].faces[0].attributes.hasOwnProperty(key) && +result.images[0].faces[0].attributes[key] < 1)
				{
					if(result.images[0].faces[0].attributes[key] > race.coef)
					{
						race.coef =result.images[0].faces[0].attributes[key];
						race.type =key;
					}
				}

			}
		}
		else {
			alert('Error : did you upload a face picture ?')
			callback(race);
		}
		alert('There is a probability of '+race.coef*100+' % that this person is '+race.type)
		callback(race);
  });



}




function toDataURL(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL('image/jpeg', 1.0);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}

function imageComputing(file,callback)
{
	toDataURL(file[0].preview,
		function(dataUrl) {
			callApi(dataUrl, function(result) {
				console.log('ici ---------');
				console.log(result);
				console.log(result.type);
				callback(result);
				}

			);
		}
	)
}

var DropzoneDemo = React.createClass({
    getInitialState: function () {
        return {
          files: []
        };
    },

    onDrop: function (files) {
		this.setState({
        files: files
      });

			imageComputing(files, function(result)
			{

			});


    },


    onOpenClick: function () {
      this.refs.dropzone.open();
    },

    render: function () {
        return (
					<div className={s.root}>
					<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
						<div className={s.container}>
							<h1 className={s.title}>React.js News</h1>
							<Dropzone onDrop={this.onDrop} >
								<div>Try dropping one file here.</div>
							</Dropzone>
							{this.state.files.length > 0 ? <div>
										<h2>Uploading {this.state.files.length} files...</h2>
										<div>{this.state.files.map((file) => <img src={file.preview} /> )}</div>
										</div> : null}
						</div>
					</div>
        );
    }
});





function Analyse({ title }) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>{title}</h1>
        <p>...</p>

      </div>
    </div>
  );
}

//React.render(<DropzoneDemo />,document.getElementById('root'));

Analyse.propTypes = { title: PropTypes.string.isRequired };
export default DropzoneDemo;
