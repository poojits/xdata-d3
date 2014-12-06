$(document).ready(function() {
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });
  $("#cq1").on('click',cq1);
  $("#cq2").on('click',cq2);
  $("#cq3").on('click',cq3);
  $("#cq4").on('click',cq4);

  	var slider = new Slider("#date");
    slider.on("slide", function(slideEvt) {
    	$("#default_date").text(slideEvt.value);
    });

});
function cq1(event) {
  event.preventDefault();
  $('#canvas-div').empty();
  $.getJSON( "/cq1" , {startDate: "2010-01", endDate: "2013-01", field: "salary"}, function( json ) {
    console.log(json);
    makeMap(json,3000);
  });
}
function cq2(event) {
  event.preventDefault();
  $('#canvas-div').empty();
}
function cq3(event) {
  event.preventDefault();
  $('#canvas-div').empty();
}
function cq4(event) {
  event.preventDefault();
  $('#canvas-div').empty();
}
function makeMap(data, scale) {
  // canvas resolution
  var width = 960;
  var height = 700;
  // projection-settings for mercator
  var projection = d3.geo.mercator()
    // where to center the map in degrees
    .center([0, 40])
    // zoomlevel
    .scale(200)
    // map-rotation
    .rotate([0, 0]);
  // defines "svg" as data type and "make canvas" command
  var svg = d3.select("#canvas-div").append("svg")
    .attr("width", width)
    .attr("height", height);
  // defines "path" as return of geographic features
  var path = d3.geo.path()
    .projection(projection);
  // group the svg layers
  var g = svg.append("g");
  // load data and display the map on the canvas with country geometries
  d3.json("/javascripts/world-110m.json", function(error, topology) {
    g.selectAll("path")
      .data(topojson.feature(topology, topology.objects.countries)
        .features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class","land");

    svg.append("g")
      .attr("class","bubble")
      .selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("transform", function(d) {
        return "translate(" + projection([
          d.longitude,
          d.latitude
        ]) + ")"
      })
      .attr("r", function(d) {
        return Math.log(d.count*scale)*2;
      })
      .append("title").text(function(d){
        return "tooltip";
      });

  });

d3.select(self.frameElement).style("height", height + "px");
}