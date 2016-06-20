var express     = require("express"),
	path		= require('path'),
  	app         = express();
	api 		= require('./routes/api.js'),
	bodyParser 	= require('body-parser');   
app.use(bodyParser.urlencoded({ extended: false,limit: '5mb' }));          
app.use(bodyParser.json({limit: '5mb'})); // parse application/vnd.api+json as json        
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
