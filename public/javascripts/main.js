$(document).ready(function() {
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });
  $("#cq1").on('click',cq1);
  $("#cq2").on('click',cq2);
  $("#cq3").on('click',cq3);
  $("#cq4").on('click',cq4);
});
function cq1(event) {
  event.preventDefault();
  var cq = $(this).id;
  console.log(event.target.id);
}
function cq2(event) {
  event.preventDefault();
  var cq = $(this).id;
  console.log(event.target.id);
}
function cq3(event) {
  event.preventDefault();
  var cq = $(this).id;
  console.log(event.target.id);
}
function cq4(event) {
  event.preventDefault();
  var cq = $(this).id;
  console.log(event.target.id);
}
function makeMap(data) {
  // canvas resolution
  var width = 900;
  var height = 600;
  // projection-settings for mercator
  var projection = d3.geo.mercator()
    // where to center the map in degrees
    .center([0, 40])
    // zoomlevel
    .scale(100)
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
      .attr("d", path);
    svg.selectAll(".pin")
      .data(data)
      .enter().append("circle", ".pin")
      .attr("r", function(d) {
        return d.latitude * 0.5;
      })
      .attr("transform", function(d) {
        return "translate(" + projection([
          d.longitude,
          d.latitude
        ]) + ")"
      });
  });
}