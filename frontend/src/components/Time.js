/* eslint-disable react/prop-types */
import moment from "moment";
import React, { useState, useEffect } from "react";

function Time({ timestamp }) {
  const [occupiedTime, setOccupiedTime] = useState("");

  useEffect(() => {
    const calculateOccupiedTime = () => {
      const now = moment();
      const diff = now.diff(timestamp);
      const duration = moment.duration(diff);

      const minutes = Math.floor(duration.asMinutes());
      const hours = Math.floor(duration.asHours());

      let formattedTime = "";

      if (minutes < 60) {
        formattedTime = `${minutes} min ago`;
      } else if (hours < 24) {
        formattedTime = `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else {
        formattedTime = `${Math.floor(hours / 24)} day${
          Math.floor(hours / 24) > 1 ? "s" : ""
        } ago`;
      }

      setOccupiedTime(formattedTime);
    };

    calculateOccupiedTime();

    const timer = setInterval(calculateOccupiedTime, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timestamp]);

  return <div>{occupiedTime}</div>;
}

export default Time;
