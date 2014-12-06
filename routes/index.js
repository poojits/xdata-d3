var express = require('express');
var router = express.Router();
var geohash = require('ngeohash');
var request = require('request');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'XDATA visualization with D3' });
});

router.get('/cq1', function(req, res) {

	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	var field = req.query.field;
	var url = 'http://d3.poojit.com:8080/solr/oodt-fm/select?q=postedDate:['+startDate+'-01T00:00:00Z%20TO%20'+endDate+'-31T00:00:00Z]&facet=true&facet.pivot=geohash3,'+field+'&f.'+field+'.facet.limit=1&f.geohash3.facet.limit=300&wt=json&indent=false';
	console.log('Solr URL: ' + url);
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	body = JSON.parse(body);
	  	var pivots = body.facet_counts.facet_pivot['geohash3,'+field];
	    var totalCount = 0;
	    var output = [];
	    if(pivots.length==0){
	    	res.json({});
	    }
	    else{
		    var max = pivots[0].pivot[0].count;
		    for(var i=0;i<pivots.length;i++){
		    	if(pivots[i].pivot.length==0) continue;
					var latlon = geohash.decode(pivots[i].value);
		    	var latitude = latlon.latitude;
		    	var longitude = latlon.longitude;
		    	var obj = {};
		    	obj["latitude"] = latitude;
		    	obj["longitude"] = longitude;
		    	obj["count"] = (pivots[i].pivot[0].count/max);
		    	obj["value"] = pivots[i].pivot[0].value;
		    	obj["realCount"] = pivots[i].count;
		    	output.push(obj);
		    }
		    res.json(output);
		  }
	  }
	});
});

module.exports = router;


