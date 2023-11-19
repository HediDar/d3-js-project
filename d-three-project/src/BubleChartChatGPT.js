import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BubbleChartChatGPT = () => {
  const [data, setData] = useState([
    {
      label: "label1",
      value: 10,
      group: "group1",
      title: "title1",
      link: "link1",
    },
    {
      label: "label2",
      value: 20,
      group: "group2",
      title: "title2",
      link: "link2",
    },
    {
      label: "label3",
      value: 30,
      group: "group3",
      title: "title3",
      link: "link3",
    },
  ]);
  const chartRef = useRef(null);
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  useEffect(() => {



    
  }, [data]);

  return <div ref={chartRef}></div>;
};

export default BubbleChartChatGPT;
