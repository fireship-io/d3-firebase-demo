import * as d3 from 'd3';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import db from './firebase';
const addButton = document.getElementById('add');

addButton.onclick = (e) => {
  return addDoc(collection(db, 'weather-data'), {
    // Random temperature between 0-100 degrees
    temp: Math.round(Math.random() * 100),
    date: new Date().toUTCString(),
  });
};

// Firestore reference
const ref = collection(db, 'weather-data');

// Graph styling
const svgWidth = 800;
const svgHeight = 600;

const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .style('border', '2px solid gray'); // Chart border

const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = svgWidth - margin.left - margin.right;
const graphHeight = svgHeight - margin.top - margin.bottom;

// Initialize the graph
const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Initialize each axis
const xAxisGroup = graph.append('g').attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

// Scaling band for the x-axis(timestamps)
const xScale = d3.scaleBand().range([0, graphWidth]).paddingInner(0.2).paddingOuter(0.2);

// Linear scaling for the y-axis(temperature)
const yScale = d3.scaleLinear().range([graphHeight, 0]);

// Scale the x-axis (timestamps)
const xAxis = d3.axisBottom(xScale);

// Adds a temperature label for every 10 degrees
const yAxis = d3
  .axisLeft(yScale)
  .ticks(10)
  .tickFormat((d) => `${d} degrees`);

// Update the graph when new data is added
const update = (data) => {
  // Handle the scaling domains
  xScale.domain(data.map((item) => item.date));
  yScale.domain([0, d3.max(data, (d) => d.temp)]);

  const rects = graph.selectAll('rect').data(data);

  //Remove extra nodes from the DOM
  rects.exit().remove();

  // Initial graph scaling and styling for entries
  rects
    .attr('width', xScale.bandwidth)
    .attr('height', (d) => graphHeight - yScale(d.temp))
    .attr('x', (d) => xScale(d.date))
    .attr('y', (d) => yScale(d.temp))
    .style('fill', 'orange');

  // Graph scaling and styling for new entries
  rects
    .enter()
    .append('rect')
    .attr('width', xScale.bandwidth)
    .attr('height', (d) => graphHeight - yScale(d.temp))
    .attr('x', (d) => xScale(d.date))
    .attr('y', (d) => yScale(d.temp))
    .style('fill', 'orange'); // Bar color

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  // Handle the graph label styling
  xAxisGroup
    .selectAll('text')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-40)') // tilt the timestamps by 40 degrees
    .attr('fill', 'orange') // Timestamp(x-axis) color
    .attr('font-size', '0.5rem'); //  Timestamp(x-axis) font size

  yAxisGroup
    .selectAll('text')
    .attr('text-anchor', 'end')
    .attr('fill', 'orange') //  Temperature(y-axis) color
    .attr('font-size', '0.75rem'); // Temperature(y-axis) font size
};

// Data source
let data = [];

// Firestore realtime data stream
let unsubscribe = onSnapshot(ref, (docSnap) => {
  docSnap.docs.map((doc) => data.push(doc.data()));
  update(data);
});

unsubscribe;
