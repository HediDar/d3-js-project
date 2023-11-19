import { useRef, useEffect, useState } from "react";
import { select } from "d3";
import "./App.css";
import BarChart from "./components/BarChart";
import XYAxes from "./components/XYAxes";
import GoingSlowly from "./components/GoingSlowly";
import HorizontalBarCharts from "./components/HorizontalBarCharts";
import BarChartChatGPT from "./components/BarChartChatGPT";
import CurvedLines from "./components/CurvedLines";
import RacingBarChart from "./components/RacingBarChart";
import PieChart from "./components/PieChart";
import BubbleChartChatGPT from "./BubleChartChatGPT";
import LineChart from "./components/LineChart";
import RadarChart from "./components/RadarChart";
import VoronoiDiagram from "./components/VoronoiDiagram";
import BoxPlot from "./components/BoxPlot";

function App() {
  const svgRef = useRef();
  const data = [
    { x: 10, y: 20, radius: 50 },
    { x: 30, y: 40, radius: 8 },
    { x: 50, y: 10, radius: 12 },
  ];
  useEffect(() => {
    //sorting the data array by higher value
    // const svg = select(svgRef.current);
    // svg
    //   .selectAll("circle")
    //   .data(data)
    //   .join(
    //     (enter) => enter.append("circle"),
    //     (update) => update.attr("class", "update"),
    //     (exit) => exit.remove()
    //   )
    //   .attr("r", (value) => value) //the second value is the value from data
    //   .attr("cx", (value) => value * 2)
    //   .attr("cy", (value) => value * 2)
    //   .attr("stroke", "red");
  }, []);

  return (
    <div>
      <br></br>

      <br></br>
      <BarChart />
      <XYAxes />

      <br></br>
      <CurvedLines />
      <br></br>
      <br></br>
      <HorizontalBarCharts />

      <br></br>
      <br></br>
      <BarChartChatGPT />
      <br></br>
      <br></br>
      <GoingSlowly />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <RacingBarChart />
      <br></br>
      <br></br>
      <br></br>
      <PieChart />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <BubbleChartChatGPT data={data} />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <LineChart />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <RadarChart numberOfCircles={5} radius={48} />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <VoronoiDiagram />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <BoxPlot />
    </div>
  );
}

export default App;
