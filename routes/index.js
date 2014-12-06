var express = require('express');
var router = express.Router();
var geohash = require('ngeohash');
var request = require('request');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'XDATA visualization with D3' });
});

router.get('/cq1', function(req, res) {
	var url = 'http://d3.poojit.com:8080/solr/oodt-fm/select?q=postedDate:[2010-11-03T00:00:00Z%20TO%202013-12-03T00:00:00Z]&facet=true&facet.pivot=geohash2,salary&f.salary.facet.limit=1&f.geohash2.facet.limit=100&wt=json&indent=true';
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	body = JSON.parse(body);
	  	var pivots = body.facet_counts.facet_pivot['geohash2,salary'];
	    var totalCount = 0;
	    var output = [];
	    var max = pivots[0].count;
	    console.log(max);
	    for(var i=0;i<pivots.length;i++){
			var latlon = geohash.decode(pivots[i].value);
	    	var latitude = latlon.latitude;
	    	var longitude = latlon.longitude;
	    	var obj = {};
	    	obj.latitude = latitude;
	    	obj.longitude = longitude;
	    	obj.count = (pivots[i].count/max)*5;
	    	output.push(obj);
	    }
	    res.json(output);
	  }
	});
});

module.exports = router;


