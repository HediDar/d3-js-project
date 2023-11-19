import React, { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import "../App.css";

const PieChart = () => {
  const [data, setData] = useState([
    { label: "Apples", value: 10 },
    { label: "banana", value: 20 },
    { label: "avocado", value: 17 },
    { label: "mandarine", value: 22 },
    { label: "strawberies", value: 45 },
    { label: "test", value: 5 },
    { label: "potato", value: 13 },
  ]);
  const mySVGRef = useRef(null);
  const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  };
  const outerRadius = 300;
  const innerRadius = 100; //inner radius greater and greater, the pie becomes donut
  const width = 2 * outerRadius + margin.left + margin.right;
  const height = 2 * outerRadius + margin.top + margin.bottom;
  useEffect(() => {
    // Remove the old svg
    d3.select(mySVGRef.current).select("svg").remove();
    // const colorScale = d3 //Interpolation is the process of estimating unknown values that fall between known values.
    //   .scaleSequential()
    //   .interpolator(d3.interpolateCool)
    //   .domain([0, data.length]);
    //create the color range
    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.label))
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
          .reverse()
      );

    // Create new svg
    const svg = d3
      .select(mySVGRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g") // this line is not necessary apparently
      .attr("transform", `translate(${width / 1.5}, ${height / 2})`); // this is necessary so that the chart does not go out of the screen

    // we use opacity 0 to make the pie invisible at first and then we put a delay and a transition then make opacity 1 again to show the pie
    svg.style("opacity", 0);

    //   d3.arc doesn’t actually draw any arcs yet but it is used to create an arcGenerator which will be used to draw the sectors of the pie.
    // Similarly, d3.pie doesn’t draw the pie but it used to compute the necessary angles to represent our data as a pie.
    const arcGenerator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const pieGenerator = d3
      .pie()
      .padAngle(0)
      .value((d) => d.value);

    const arc = svg.selectAll().data(pieGenerator(data)).enter();

    var last_coordinates = [];

    // Append arcs and create the pie
    arc
      .append("path")
      .attr("d", arcGenerator)
      .style("fill", (d, i) => colorScale(i))
      .style("stroke", "#ffffff")
      .style("stroke-width", 5) /// stroke is the distance between each slice
      // .on("click", function (event, d) {
      // })

      .on("mouseover", function (event, d) {
        //show text in the center of the pie and translate the slice
        d3.select(this).style("opacity", 0.8);
        // Show tooltip or perform any desired action
        //translate the pie so it looks as it has been selected
        const [x, y] = arcGenerator.centroid(d);
        d3.select(this).attr("transform", `translate(${x * 0.1}, ${y * 0.1})`);
        last_coordinates = [x, y];
        //add the text value when mouse over
        svg
          .append("text")
          .attr("id", "valueLabel")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .text(d.data.value)
          .style("fill", "#000000")
          .style("font-weight", "bold");
        //   .attr("transform", `translate(${x}, ${y})`);//we dont need to translate as the coordinates 0,0 are already in the center of the donut chart
      })
      //remove text in the center of the pie and translate the slice to tis original value
      .on("mouseout", function (event, d) {
        d3.select(this).style("opacity", 1);
        const [x, y] = arcGenerator.centroid(d);
        d3.select(this).attr(
          "transform",
          `translate(${last_coordinates[0] - x}, ${last_coordinates[1] - y})`
        );

        // Hide tooltip or revert any changes
        svg.select("#valueLabel").remove();
      });
    // Append text labels
    //add arows that are always visible
    arc.each(function (d) {
      //x and y are exactly the center coordinates of the slice
      const [x, y] = arcGenerator.centroid(d);
      // add the first line with its relative coordinates
      svg
        .append("line")
        .attr("id", "arrow")
        .attr("x1", x * 1.3)
        .attr("y1", y * 1.3)
        .attr("x2", x * 1.7)
        .attr("y2", y * 1.7)
        .attr("stroke", "#808080");
      // add the second line with its relative coordinates
      svg
        .append("line")
        .attr("id", "arrow")
        .attr("x1", x * 1.7)
        .attr("y1", y * 1.7)
        .attr("x2", x * 2.1)
        .attr("y2", y * 1.7)
        .attr("stroke", "#808080")
        .attr("marker-end", "url(#arrowhead)"); // this line allows us to link the arrow head to the end of this like (id arrowhead)
      //arrow head linked to the line just below using the id arrowhead
      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#000000");

      arc
        .append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text((d) => {
          return d.data.label;
        })
        //   .style("fill", (_, i) => colorScale(data.length - i))
        .style("fill", "black")
        .attr("transform", (d) => {
          const [x, y] = arcGenerator.centroid(d);
          return `translate(${x * 2.1}, ${y * 1.7 - 8})`;
        });
    });

    arc
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text((d) => {
        return d.data.label;
      })
      //   .style("fill", (_, i) => colorScale(data.length - i))
      .style("fill", "white")
      .attr("transform", (d) => {
        const [x, y] = arcGenerator.centroid(d);
        return `translate(${x}, ${y})`;
      });

    //add the legends
    var legends = svg
      .append("g")
      .attr("transform", "translate(500,-250)")
      .selectAll(".legends") // the name here doesnt matter for some reason
      .data(data);
    legends
      .enter()
      .append("g")
      .classed("legends-graph", true) // name of the class of the g element that will contain the rects we added
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * 30;
      })
      //color of each rect
      .attr("fill", (d, i) => colorScale(i));
    //text of each rectangle

    legends
      .enter()
      .append("g") // this line is optional but preferable i think
      .classed("legends-label", true)// name of the class of the g element that will contain the labels we added
      .append("text")
      .text((d, i) => d.label)
      .attr("fill", "black")
      .attr("x", 23)
      .attr("y", function (d, i) {
        return i * 30+14;
      })

    svg.transition().delay(100).style("opacity", "1");

    // append value labels
    // arc
    //   .append("text")
    //   .attr("text-anchor", "middle")
    //   .attr("alignment-baseline", "middle")
    //   .text((d) => d.data.value)
    //   .style("fill", "#ffffff")
    //   .style("font-weight", "bold")
    //   .attr("transform", (d) => {
    //     const [x, y] = arcGenerator.centroid(d);
    //     return `translate(${x}, ${y + 30})`;
    //   });
  }, [data]);

  //   function handleClick(d) {

  //     console.log(d.target.__data__.data.value);
  //     // You can perform any desired action with the clicked data
  //   }
  const randomNumberBetweenThreeTen = useCallback(() => {
    var min = Math.ceil(3);
    var max = Math.floor(10);
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    min = Math.ceil(0);
    max = Math.floor(data.length - 1);
    const elementIndexToUpdate =
      Math.floor(Math.random() * (max - min + 1)) + min;
    let myTransitionArray = [...data];
    myTransitionArray[elementIndexToUpdate].value += randomNumber;
    setData(myTransitionArray);
  }, [data]);
  return (
    <div>
      <div ref={mySVGRef}></div>
      <button
        onClick={() => {
          let myTransition = [...data];
          myTransition.pop(); // removes the last element of the array
          setData(myTransition);
        }}
      >
        Remove data
      </button>
      <button onClick={randomNumberBetweenThreeTen}>Add values</button>
      <button
        onClick={useCallback(() => {
          const min = Math.ceil(1);
          const max = Math.floor(50);
          const randomNumber =
            Math.floor(Math.random() * (max - min + 1)) + min;
          let myTransitionTab = [...data];
          myTransitionTab.push({
            label: "test" + data.length,
            value: randomNumber,
          });
          setData(myTransitionTab);
        }, [data])}
      >
        Add random data
      </button>
    </div>
  );
};

export default PieChart;
