import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// TODO: Refactoring to smaller component
const margin     = {top: 20, right: 20, bottom: 110, left: 40};
const margin_nav = {top: 320, right: 20, bottom: 30, left: 40};
const width      = 800 - margin.left - margin.right;
const height     = 400 - margin.top - margin.bottom;
const height_nav = 400 - margin_nav.top - margin_nav.bottom;

interface data {
  x: number;
  y: number;
}

const App: React.FC = () => {
  const ref = useRef(null);

  useEffect(() => {
    const svgElement = d3.select(ref.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    // Scales setup
    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);
    const xScale_nav = d3.scaleLinear().range([0, width]);
    const yScale_nav = d3.scaleLinear().range([height_nav, 0]);

    // Axis setup
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const brush = d3.brushX()
      .extent([[0, 0], [width, height_nav]])
      .on("brush end", brushed);

    var lineGen = d3.line<data>()
      .x(function (d) { return xScale(d.x); })
      .y(function (d) { return yScale(d.y); });

    var lineGen_nav = d3.line<data>()
      .x(function (d) { return xScale_nav(d.x); })
      .y(function (d) { return yScale_nav(d.y); });

    svgElement.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    var lineChartMain = svgElement.append("g")
      .attr("class", "focus")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("clip-path", "url(#clip)");

    var mainPane = svgElement.append("g")
      .attr("class", "focus")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    var navPane = svgElement.append("g")
      .attr("class", "context")
      .attr("transform", `translate(${margin_nav.left},${margin_nav.top})`);

    var dataset: data[] = []

    const updateApp = () => {
      // HACK: extent return [undefined, undefined]
      var xlimit = d3.extent(dataset, (d) => d.x)
      var ylimit = d3.extent(dataset, (d) => d.y)
      xScale.domain([xlimit[0] ?? 0, xlimit[1] ?? 0])
      yScale.domain([ylimit[0] ?? 0, ylimit[1] ?? 0])
      xScale_nav.domain(xScale.domain());
      yScale_nav.domain(yScale.domain());

      mainPane.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      mainPane.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

      lineChartMain.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1)
        .attr('fill', 'none')
        .attr("d", lineGen);

      navPane.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1)
        .attr('fill', 'none')
        .attr("d", lineGen_nav);

      navPane.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height_nav + ")")
        .call(xAxis);

      navPane.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, xScale.range());
    }

    d3.csv("/file/csv/si-ax.csv").then((parsed) => {
      parsed.forEach((row) => {
        dataset.push({x:+(row.x ?? 0), y:+(row.y ?? 0)})
      });
      updateApp()
    });

    function brushed({selection}: {selection: any}) {
      var s = selection || xScale_nav.range();
      var realMainDomain = s.map(xScale_nav.invert, xScale_nav);
      xScale.domain(realMainDomain);
      mainPane.select(".axis--x").call(xAxis as any);
      lineChartMain.select(".line").attr("d", lineGen as any);
    }

  }, [])

  return(
    <div>
      <svg ref={ref}></svg>
    </div>
  )
}

export default App;
