var temporalStart = false;
var temporalStart2 = false;
var temporalStart4 = false;
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
    var inc = slideEvt.value
  	$("#default_date").text(monthYear(slideEvt.value));
  });
  var slider2 = new Slider("#date2");
  slider2.on("slide", function(slideEvt) {
    var inc = slideEvt.value
    $("#default_date2").text(monthYear(slideEvt.value));
  });
  var slider4 = new Slider("#date4");
  slider4.on("slide", function(slideEvt) {
    var inc = slideEvt.value
    $("#default_date4").text(monthYear(slideEvt.value));
  });
  var cq1T = false;
  var cq2T = false;
  var cq4T = false;
  slider.on("change", function(changeEvt){
    cq1T = !cq1T;
    if(cq1T){
      temporalStart = true;
      var yearMonth = $('#default_date').text();
      makecq1({startDate: yearMonth, endDate: yearMonth, field: getCQ1Attr()});
    }
  });
  slider2.on("change", function(changeEvt){
    cq2T = !cq2T;
    if(cq2T){
      temporalStart2 = true;
      var yearMonth = $('#default_date2').text();
      var cn = getCompanyName();
      if(cn!=false)
        makecq2({startDate: yearMonth, endDate: yearMonth, company_name: cn});
    }
  });
  slider4.on("change", function(changeEvt){
    cq4T = !cq4T;
    if(cq4T){
      temporalStart4 = true;
      var yearMonth = $('#default_date4').text();
      var jc = getJobCat();
      if(jc!=false)
        makecq4({startDate: yearMonth, endDate: yearMonth, jobcat: jc});
    }
  });
});
function getCQ1Attr() {
  var selected = $('.selectpicker option:selected').val();
  var attr;
  if(selected == "Company") attr = "company";
  if(selected == "Salary") attr = "salary";
  if(selected == "Job Type") attr = "jobtype";
  return attr;
}
function cq1Attr(){
  var attr = getCQ1Attr();
  if(temporalStart) {
    var yearMonth = $('#default_date').text();
    makecq1({startDate: yearMonth, endDate: yearMonth, field: attr});
  }
  else {
    makecq1({startDate: "2010-01", endDate: "2013-12", field: attr});
  }
}
function monthYear(inc) {
  var by6 = inc/6;
  var output;
  if(by6 <= 1){
    output = "2012-" + (6 + inc);
  }
  else{
    inc -= 6;
    output = "2013-" + inc;
  }
  return output;
}
function makecq1(params) {
  //$('#canvas-div').empty();
  $.getJSON( "/cq1" , params, function( json ) {
    updateMap(json,3000);
  });
}
function cq1(event) {
  event.preventDefault();
  $('.selectpicker').val('Salary');
  hideControls();
  makecq1({startDate: "2010-01", endDate: "2013-12", field: "salary"});
  $('.cq-1').css("display","block");
}
function hideControls() {
  $('.cq-1').css("display","none");
  $('.cq-2').css("display","none");
  $('.cq-4').css("display","none");
  temporalStart = false;
  temporalStart2 = false;
  temporalStart4 = false;
}
function runcq2(){
  var cn = $('#company_name').val();
  if(temporalStart2) {
    var yearMonth = $('#default_date2').text();
    makecq2({startDate: yearMonth, endDate: yearMonth, company_name: cn});
  }
  else {
    makecq2({startDate: "2010-01", endDate: "2013-12", company_name: cn});
  }
  return false;
}
function runcq4(){
  var jb = $('#jobcat').val();
  if(temporalStart4) {
    var yearMonth = $('#default_date4').text();
    makecq4({startDate: yearMonth, endDate: yearMonth, jobcat: jb});
  }
  else {
    makecq4({startDate: "2010-01", endDate: "2013-12", jobcat: jb});
  }
  return false;
}
function makecq2(params) {
  //$('#canvas-div').empty();
  $.getJSON( "/cq2" , params, function( json ) {
    updateMap(json,3000);
  });
}
function makecq4(params) {
  //$('#canvas-div').empty();
  $.getJSON( "/cq4" , params, function( json ) {
    updateMap(json,3000);
  });
}
function getCompanyName() {
  var cn = $('#company_name').val();
  if(cn.length==0){
    alert('Please enter a company name.');
    return false;
  }
  return cn;
}
function getJobCat() {
  var jc = $('#jobcat').val();
  if(jc.length==0){
    alert('Please enter a job category.');
    return false;
  }
  return jc;
}
function cq2(event) {
  $('#company_name').val('');
  event.preventDefault();
 // $('#canvas-div').empty();
  hideControls();
  $('.cq-2').css("display","block");
  alert('Please enter a company name.');
}
function cq4(event) {
  $('#jobcat').val('');
  event.preventDefault();
  //$('#canvas-div').empty();
  hideControls();
  $('.cq-4').css("display","block");
  alert('Please enter a job category.');
}
function cq3(event) {
  event.preventDefault();
  //$('#canvas-div').empty();
  hideControls();
  $.getJSON( "/cq3" , function( json ) {
    updateMap(json,3000);
  });
}
function updateMap(data, scale) {
  if($('#cq-data').length==0){
    makeMap(data,scale);
  }
  else{
    var projection = d3.geo.mercator()
    // where to center the map in degrees
    .center([0, 40])
    // zoomlevel
    .scale(200)
    // map-rotation
    .rotate([0, 0]);
    console.log('updateMap called');
    var svg = d3.select("#canvas-div svg");
    $('#cq-data').remove();
    svg.append("g")
        .attr("id","cq-data")
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
          return Math.log(1+d.count*scale)*2;
        })
        .append("title").text(function(d){
          return d.value + ', Count: ' + d.realCount ;
        });
  }
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
      .attr("id","cq-data")
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
        return Math.log(1+d.count*scale)*2;
      })
      .append("title").text(function(d){
        return d.value + ', Count: ' + d.realCount ;
      });

  });

d3.select(self.frameElement).style("height", height + "px");
}