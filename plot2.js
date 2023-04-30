// set the dimensions and margins of the graph
var margin_2nd = {top: 60, right: 30, bottom: 40, left: 20}
var height = 550 - margin_2nd.top - margin_2nd.bottom;

axis_mapping = {
  parental_lvl: "parental level of education",
  gender: "gender",
  race: "race/ethnicity"
}

d3.csv("StudentsPerformance.csv").then(function(data) {
  let container_width = d3.select(".plot1").node().clientWidth;
  let svg_width = width_ratio * container_width;

  let svg = d3.select(".plot2 .plot-area")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", height + margin_2nd.top + margin_2nd.bottom)
  
  let area_2nd = svg.append("g")
    .attr("class", "area")
    .attr("width", svg_width)
    .attr("transform", "translate(" + margin.left + ", 0)");

  let yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([500, 50]);

  area_2nd.append("g")
    .attr("transform", "translate(" + (margin_2nd.left + 5) + ",0)")
    .call(d3.axisLeft(yScale));

  let x_axis, nestedData, keys, xScale, box_plots;

  x_axis = axis_mapping[d3.select(".plot2 .x-axis").property("value")]

  function plot_2(x_axis) {
    x_axis = axis_mapping[d3.select(".plot2 .x-axis").property("value")];

    nestedData = d3.group(data, function(d) {
      return d[x_axis];
    });

    keys = [...nestedData.keys()]
    if (x_axis == "parental level of education") {
      keys.sort(function(a, b) {
        return education_order.indexOf(a) - education_order.indexOf(b);
      });
    }
    else if (x_axis == "gender") {
      keys.sort(function(a, b) {
        return gender_order.indexOf(a) - gender_order.indexOf(b);
      });
    }
    else{
      keys.sort(function(a, b) {
        return race_order.indexOf(a) - race_order.indexOf(b);
      });
    }

    xScale = d3.scaleBand()
      .domain(keys)
      .range([50, svg_width * 0.95])
      .padding(0.1);

    area_2nd.append("g")
      .attr("class", "x_scale")
      .attr("transform", "translate(0," +  (margin_2nd.top + height) + ")")
      .call(d3.axisBottom(xScale));

    box_plots = area_2nd.append("g")
      .selectAll('g')
      .data(nestedData)
      .enter()
      .append('g')
      .attr('transform', function(d) { return 'translate(' + xScale(d[0]) + ',0)'; });

    box_plots.each(function(d) {
      var sorted_values = d[1]
        .map(function(e) {return +e["average score"]; })
        .filter(function(e) { return e["average score"] != "NaN"})
        .sort(d3.ascending);

      var q1 = d3.quantile(sorted_values, 0.25);
      var median = d3.quantile(sorted_values, 0.50);
      var q3 = d3.quantile(sorted_values, 0.75);

      var iqr = q3 - q1;
      var whiskerMin = d3.min(sorted_values.filter(function(e) { return e >= q1 - 1.5 * iqr; }));
      var whiskerMax = d3.max(sorted_values.filter(function(e) { return e <= q3 + 1.5 * iqr; }));

      d3.select(this)
        .append('line')
        .attr('x1', xScale.bandwidth() / 2)
        .attr('y1', yScale(whiskerMin))
        .attr('x2', xScale.bandwidth() / 2)
        .attr('y2', yScale(whiskerMax))
        .attr('stroke', 'green')
        .attr('stroke-width', 1)
        .attr('fill', 'none');

      d3.select(this)
        .append('rect')
        .attr('x', 0)
        .attr('y', yScale(q3))
        .attr('width', xScale.bandwidth())
        .attr('height', yScale(q1) - yScale(q3))
        .attr('fill', 'white')
        .attr('stroke', 'red')
        .attr('stroke-width', 1);

      d3.select(this)
        .append('line')
        .attr('x1', 0)
        .attr('y1', yScale(median))
        .attr('x2', xScale.bandwidth())
        .attr('y2', yScale(median))
        .attr('stroke', 'blue')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
    });
  }

  let title_2, x_lab_2, y_lab_2;

  function add_title_2(x_axis) {// add chart title
    title_2 = svg.append("text")
      .attr("x", svg_width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "17px")
      .text(`Average Score among different levels in ${capitalizeWords(x_axis)}`)

    x_lab_2 = svg.append("text")
      .attr("x", svg_width / 2)
      .attr("y", height + margin.top + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "17px")
      .text(`${capitalizeWords(x_axis)}`)

    y_lab_2 = svg.append("text")
      .attr("x", margin.left / 2)
      .attr("y", height / 2 + 10)
      .attr("transform", `rotate(-90, ${margin.left/2}, ${height/2 + 10})`)
      .attr("text-anchor", "middle")
      .style("font-size", "17px")
      .text(`Average Score`)
  }

  function remove_2() {
    d3.select(".x_scale").remove();
    title_2.remove();
    x_lab_2.remove();
    box_plots.remove();
  }

  plot_2(x_axis)
  add_title_2(x_axis)

  d3.select(".plot2 .x-axis").on("change", function() {
    x_axis = axis_mapping[d3.select(".plot2 .x-axis").property("value")];
    remove_2();
    plot_2(x_axis)
    add_title_2(x_axis)
  })
})