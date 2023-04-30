// set the dimensions and margins of the graph
var margin_3nd = {top: 60, right: 30, bottom: 40, left: 20}
var height = 550 - margin_3nd.top - margin_3nd.bottom;

axis_mapping = {
  parental_lvl: "parental level of education",
  gender: "gender",
  race: "race/ethnicity"
}

d3.csv("StudentsPerformance.csv").then(function(data) {
  let width_ratio = 0.8;
  var nestedData = d3.group(data, d => d["test preparation course"]);
  var prepData = [];

  nestedData.forEach(function(value, key) {
    var mathScore = d3.mean(value, function(d) { return parseFloat(d["math score"]); });
    var readingScore = d3.mean(value, function(d) { return parseFloat(d["reading score"]); });
    var writingScore = d3.mean(value, function(d) { return parseFloat(d["writing score"]); });
    key = (key == "completed") ? "Completed" : "No completed";

    prepData.push({
      test_preparation_course: key,
      score: mathScore.toFixed(2),
      name: "math"
    });
    prepData.push({
      test_preparation_course: key,
      score: readingScore.toFixed(2),
      name: "reading"
    });
    prepData.push({
      test_preparation_course: key,
      score: writingScore.toFixed(2),
      name: "writing"
    });
  });

  let container_width = d3.select(".plot3").node().clientWidth;
  let svg_width = width_ratio * container_width;

  var yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top]);
  
  xScale_choices = ["Math score in No completed level",
    "Reading score in No completed level",
    "Writing score in No completed level",
    "Math score in Completed level",
    "Reading score in Completed level",
    "Writing score in Completed level"]
  var xScale = d3.scaleBand()
    .domain(xScale_choices)
    .range([margin.left, svg_width - margin.right])
    .padding(0.1);

  var svg = d3.select('.plot3 .plot-area')
    .append('svg')
    .attr('width', svg_width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  let area_3nd = svg.append("g")
    .attr("class", "area")
    .attr("width", svg_width)
    .attr("transform", "translate(" + margin.left + ", 0)");
  
  var bars = area_3nd.selectAll('rect')
    .data(prepData)
    .enter()
    .append('rect')
  
  bars.each(function(d) {
    d3.select(this)
      .attr('x', xScale(generateName(d.test_preparation_course, d.name)))
      .attr('y', yScale(d.score))
      .attr('width', xScale.bandwidth())
      .attr('height', function(d) { 
        return height - margin.bottom - yScale(d.score); 
      })
      .attr('fill', function(d) {
        if (d.name == "math") {
          return "blue"
        } else if (d.name == "reading") {
          return "red"
        } else {
          return "green"
        }
      });

    area_3nd.append("text")
      .attr("x", xScale(generateName(d.test_preparation_course, d.name)) + xScale.bandwidth() / 2)
      .attr("y", yScale(d.score) - 15)
      .attr("text-anchor", "middle")
      .style("font-size", "17px")
      .text(`${d.score}`)
  })

  var xAxis = d3.axisBottom(xScale);
  area_3nd.append('g')
    .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
    .call(xAxis);

  var yAxis = d3.axisLeft(yScale);
  area_3nd.append('g')
    .attr('transform', 'translate(' + margin.left + ',0)')
    .call(yAxis);

  title_2 = svg.append("text")
    .attr("x", svg_width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "17px")
    .text(`Average Score among different levels in Completed Preparation Course or not`)

  x_lab_2 = svg.append("text")
    .attr("x", svg_width / 2)
    .attr("y", height)
    .attr("text-anchor", "middle")
    .style("font-size", "17px")
    .text(`Subject Names`)

  y_lab_2 = svg.append("text")
    .attr("x", margin.left - 10)
    .attr("y", height / 2 + 5)
    .attr("transform", `rotate(-90, ${margin.left/2}, ${height/2 + 5})`)
    .attr("text-anchor", "middle")
    .style("font-size", "17px")
    .text(`Average Score Among Subjects`)
});