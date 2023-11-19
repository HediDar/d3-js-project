import React, { useState, useEffect, useRef, useCallback } from "react";
// import useResizeObserver from "../Hooks/UseResizeObserver";
import * as d3 from "d3";
import "../App.css";

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    // the return is called when the component holding the ref unmounts
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

const ResponsiveBarChart = () => {
  const mySVGRef = useRef(null);
  const dimensions = useResizeObserver(mySVGRef); //we call the custom react hook that will observe the dimensions changes on our div
  const [data, setData] = useState([25, 30, 45, 60, 10, 65, 75, 300]);
  const width = 600; //this is the width of the svg
  const height = 500;

  useEffect(() => {
    if (!dimensions) return;
    console.log(dimensions);

    var svg = d3.select(mySVGRef.current);

    // Remove existing SVG element
    svg.selectAll("svg").remove(); // this is to remove the previous svg to avoid duplication
    svg = d3
      .select(mySVGRef.current)
      .append("svg") // add an svg to our div
      .attr("width", dimensions.width) // width and height of the svg
      .attr("height", dimensions.height);

    var xscale = d3 //scaleBand utilisé pour les valeurs discrete aka les valeurs non lineaires(ex:1-2-3-... or A/B/C/...)aka des valeurs arbitraires
      .scaleBand()
      .domain(data.map((d, i) => i))
      .range([0, width])
      .padding(0.5); //this line creates a distance between each bar or each tick
    var x_axis = d3
      .axisBottom() //axis bottom positions the numbers of the axis below the axis, so we need a y translation so that the axis are really in the botom
      .scale(xscale)
      .tickFormat((index) => index + 1); //this line is to start the x axis on 1 not on zero and to translate all the elements by 1 too
    var xAxisTranslate = height / 2;

    //the translation is necessarey because every thing starts from the top left(the 0,0 coordinate), and we want the x axis to start in the middle of our div selon y ili howa height/2
    //and translate it selon x a droite by something relatively small(50px in our case) pour que ca ne soit pas collé a gauche de lecran
    svg
      .append("g") // add a group element that will contain our axis
      .attr("transform", "translate(50, " + xAxisTranslate + ")")
      .call(x_axis);

    var yscale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([height / 2, 0]); //we use height/2 because we want to drow on the top half side of the svg and it starts on the y=height/2 and end on the y=0 which is the top of our div
    var y_axis = d3.axisLeft().scale(yscale);
    svg.append("g").attr("transform", "translate(50, 0)").call(y_axis); //We then apply a translate transformation to align the y-axis to 50px right of the origin and 10px to the bottom of the origin

    var colorScale = d3
      .scaleLinear()
      .domain([75, 100, 150])
      .range(["green", "orange", "red"])
      .clamp(true); // The clamp(true) ensures that values outside the domain are clamped to the closest color in the range.

    svg
      .selectAll(".bar") //we want to draw a bar chart=> select all of existant elements with class bar in my svg
      .data(data) // using the data array
      .join("rect") //as rectangles
      .attr("class", "bar") // call the class of the bar elements bar,this line is  necessary
      .on("mouseenter", (event, value) => {
        //quand la souris entre dans la surface dune bar, on execute ce code
        // when the mouse enters a bar
        const index = svg.selectAll(".bar").nodes().indexOf(event.target);
        svg
          .selectAll(".tooltip")
          .data([value])
          // .join((enter) => enter.append("text").attr("y", yscale(value) - 4)) // this line is to make the text start from the specified y coordinate, not come from the 0 coordinate
          .join("text")
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xscale(index) + 50 + xscale.bandwidth() / 2) //the x coordinate of the text calculée selon xscale,+50 car les x axis sont transitionées par 50, xscale.banwidth()/2, c + au milieu de la bar
          .attr("text-anchor", "middle") //this will make the  text begin at the left of each bar so we add the xscale.bandwidth()/2 to make it centered
          .transition()
          .attr("y", yscale(value) - 10) //the y coordinate of the text calculée selon yscale, we substract 10 becase we want the text to be slightly over the debut of the bar
          .attr("opacity", 1);
      })
      .oeleave", () => svg.select(".tooltip").remove()) //when the mouse leaves a bar
      //.join(
      //   enter => enter.append("rect").attr("class", "bar"),
      //   update => update,
      //   exit => exit.remove()
      // )
      .style("transform", "scale(1, -1)") // to flip the bars upside down so that the transition looks better, but this makes the y coordinates start from the 0 point so this is why we change the y coordinate below
      .attr("x", (value, index) => xscale(index) + 50) //xscale(index)calcule la starting coordonné de la barre selon lindex(index start from 0 to data.length-1----+50 to match the translation we made on the x and y axis selon les coordonées x
      // .attr("y", (value) => yscale(value)) // this is the old value before the transform line
      .attr("y", (value) => -height / 2) // change the y attribute because of the transform style this is also the the starting y point of each bar
      .attr("width", xscale.bandwidth()) // this is the width of each bar
      .transition() // everything below this line will be transitionned
      .duration(1000) // Transition duration (in milliseconds)
      .attr("fill", colorScale)
      .attr("height", (value) => height / 2 - yscale(value)); // this is the length of each bar which is yscale(value) if the coordinates of d3 werent messed up
  }, [data, dimensions]);

  const updateData = useCallback((event) => {
    const min = Math.ceil(0);
    const max = Math.floor(150);
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    let myTranstionArray = data;
    myTranstionArray.push(random);
    setData([...data, random]);
    console.log(data);
  }, []);

  return (
    <div>
      <div ref={mySVGRef} style={{ width: "100%", background: "#e333" }}></div>
      <br></br>
      <button onClick={() => setData(data.map((value) => value + 5))}>
        Update data
      </button>
      <button onClick={updateData}>Add data</button>
    </div>
  );
};

export default ResponsiveBarChart;
