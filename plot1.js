var screenWidth = window.innerWidth || document.documentElement.clientWidth;
var gap = 50;
var individual_width = (screenWidth - gap) / 2;
var dot_size = 3;

// set the dimensions and margins of the graph
var margin = {top: 60, right: 30, bottom: 40, left: 30},
    width = individual_width - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

let title_map = {
  "math score": "Math Score",
  "reading score": "Reading Score",
  "writing score": "Writing Score"
}

// The first graph
d3.csv("StudentsPerformance.csv").then(function(data) {

  var svg = d3.select(".plot1 .plot-area")
    .append("svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)

  var area = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add x-axis
  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width - margin.left - margin.right - gap/2]);

  area.append("g")
    .attr("transform", "translate(" + margin.left + "," + height + ")")
    .call(d3.axisBottom(x));

  // add y-axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0 ]);
  area.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y));

  let circles;
  function plot(x_axis, y_axis){
    // add dots
    circles = area.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d[x_axis]) + margin.left; })
        .attr("cy", function (d) { return y(d[y_axis]); })
        .attr("r", dot_size)
        .style("fill", function(d) { return d["gender"] == "female" ? "red" : "blue"; })
  }

  let title, x_lab, y_lab;

  function add_title(x_axis, y_axis) {// add chart title
    title = svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top/2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(`Relationship between ${title_map[x_axis]} and ${title_map[y_axis]} Among Genders`)

    x_lab = svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(`${title_map[x_axis]}`)

    y_lab = svg.append("text")
      .attr("x", margin.left/2)
      .attr("y", height / 2 + 10)
      .attr("transform", `rotate(-90, ${margin.left/2}, ${height/2 + 10})`)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(`${title_map[y_axis]}`)
  }

  let x_axis = d3.select(".x-axis").property("value");
  let y_axis = d3.select(".y-axis").property("value");

  plot(x_axis, y_axis);
  add_title(x_axis, y_axis);

  d3.select(".x-axis").on("change", function(){
    x_axis = d3.select(this).property("value");
    circles.remove();
    title.remove();
    x_lab.remove();
    y_lab.remove();
    plot(x_axis, y_axis);
    add_title(x_axis, y_axis);
  })

  d3.select(".y-axis").on("change", function(){
    y_axis = d3.select(this).property("value");
    circles.remove();
    title.remove();
    x_lab.remove();
    y_lab.remove();
    plot(x_axis, y_axis);
    add_title(x_axis, y_axis);
  })

  // add the legend
  var legends = [
    {color: "red", label: "female"},
    {color: "blue", label: "male"}
  ]

  const legend_tag = area.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 100) + "," + (height - 150) + ")")
  
  legend_tag.selectAll("circle")
    .data(legends)
    .enter()
    .append("circle")
    .attr("cx", 0)
    .attr("cy", function(d, i) { return i * 20; })
    .attr("r", dot_size * 2)
    .style("fill", function(d) {return d.color;});

  legend_tag.selectAll("text")
    .data(legends)
    .enter()
    .append("text")
    .attr("x", dot_size * 4)
    .attr("y", function(d, i) { return i * 20 + dot_size * 1.5; })
    .text(function(d) { return d.label; })
    .attr("text-anchor", "start")
    .attr("font-size", "12px");

});
