import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';


const margin = {
  top: 40,
  bottom: 20,
  left: 50,
  right: 20,
};
const width = 800 - margin.left - margin.right;
const height = 350 - margin.top - margin.bottom;

const App: React.FC = () => {
  const ref = useRef(null);

  useEffect(() => {
    const svgElement = d3.select(ref.current)
    svgElement
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    const g = svgElement.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    // Scales setup
    const xscale = d3.scaleLinear().range([0, width]);
    const yscale = d3.scaleLinear().range([height, 0]);
    //
    // Axis setup
    const xaxis = d3.axisBottom(xscale);
    const g_xaxis = g.append("g").attr("transform", `translate(0, ${height})`);
    const yaxis = d3.axisLeft(yscale);
    const g_yaxis = g.append("g");

    // call
    g_xaxis.call(xaxis)
    g_yaxis.call(yaxis)

    interface data {
      x: number;
      y: number;
    }
    var dataset: data[] = []

    d3.csv("./si-ax.csv").then((parsed) => {
      parsed.forEach((row) => {
        if (!row.x || !row.y) {
          dataset.push({x:0, y:0})
        } else {
          dataset.push({x:+row.x, y:+row.y})
        }
      });
    });

    // HACK: extent return [undefined, undefined]
    var xlimit = d3.extent(dataset, (d) => d.x)
    var ylimit = d3.extent(dataset, (d) => d.y)
    xscale.domain([xlimit[0] ?? 0, xlimit[1] ?? 0])
    yscale.domain([ylimit[0] ?? 0, ylimit[1] ?? 0])

    g_xaxis.call(xaxis)
    g_yaxis.call(yaxis)

    var line = d3.line<data>()
      .x(function(d) { return xscale(d.x); })
      .y(function(d) { return yscale(d.y); });

    d3.select('svg').append('path')
      .attr('d', line(dataset))
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1)
      .attr('fill', 'none');

  }, [])

  return(
    <div>
      <svg ref={ref}></svg>
    </div>
  )
}

export default App;
