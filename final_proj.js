var screenWidth = window.innerWidth || document.documentElement.clientWidth;
var gap = 50;
var indiviual_width = (screenWidth - gap) / 2;
var dot_size = 3;

// set the dimensions and margins of the graph
var margin = {top: 50, right: 20, bottom: 40, left: 20},
    width = indiviual_width - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// The first graphe
var svg = d3.select("body")
  .append("svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.right + "," + margin.top + ")");
          
// read the data from the csv file
d3.csv("StudentsPerformance.csv").then(function(data) {

  // add x-axis
  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width - margin.left - margin.right - gap/2 ]);
  svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + height + ")")
    .call(d3.axisBottom(x));

  // add y-axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0 ]);
  svg.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y));

  d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("opacity", 0)

  // add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d["math score"]) + margin.left; })
      .attr("cy", function (d) { return y(d["reading score"]); })
      .attr("r", dot_size)
      .style("fill", function(d) { return d["gender"] == "female" ? "red" : "blue"; })
      .on("mouseover", function(d) {
        var that = d3.select(this);
        var tt_data = that["_groups"][0][0]["__data__"]
        d3.selectAll(".tooltip")
          .attr("opacity", 1)
          .text(`Math score: ${+tt_data["math score"]} Reading Score: ${+tt_data["reading score"]}`)
      })
      .on("mouseout", function(d) {
        d3.selectAll(".tooltip")
          .attr("opacity", 0)
      });

  // add chart title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Relationship between Math Score and Reading Score");

});


// The second graph
var second_x = gap;
var svg2 = d3.select("body")
  .append('svg')
    .attr('width', width)
    .attr('height', height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + second_x + "," + margin.top + ")")
// read the data from the csv file
d3.csv("StudentsPerformance.csv").then(function(data) {

  // add x-axis
  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, width - margin.left - margin.right - gap ]);
  svg2.append("g")
    .attr("transform", "translate(" + margin.left + "," + height + ")")
    .call(d3.axisBottom(x));

  // add y-axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0 ]);
  svg2.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y));

  d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("opacity", 0)

  // add dots
  svg2.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return  x(d["writing score"]) + margin.left; })
      .attr("cy", function (d) { return  y(d["reading score"]); })
      .attr("r", dot_size)
      .style("fill", function(d) { return d["gender"] == "female" ? "red" : "blue"; })
      .on("mouseover", function(d) {
        var that = d3.select(this);
        var tt_data = that["_groups"][0][0]["__data__"]
        d3.selectAll(".tooltip")
          .attr("opacity", 1)
          .text(`Writing score: ${+tt_data["writing score"]} Reading Score: ${+tt_data["reading score"]}`)
      })
      .on("mouseout", function(d) {
        d3.selectAll(".tooltip")
          .attr("opacity", 0)
      });

  // add chart title
  svg2.append("text")
    .attr("x", width / 2 + gap)
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Relationship between Writing Score and Reading Score");
});
