/* eslint-disable react/jsx-props-no-spreading */
import { Text } from "native-base";
import React, { useState, useEffect } from "react";

function WelcomeMessage({ ...props }) {
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    const getCurrentTime = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();

      if (currentHour >= 5 && currentHour < 12) {
        setWelcomeMessage("Good morning! ☀️");
      } else if (currentHour >= 12 && currentHour < 18) {
        setWelcomeMessage("Good afternoon! 🌤️");
      } else {
        setWelcomeMessage("Good evening! 🌙");
      }
    };

    getCurrentTime();

    const timer = setInterval(getCurrentTime, 5 * 6 * 1000); // Update every 5 min

    return () => clearInterval(timer);
  }, []);

  return <Text {...props}>{welcomeMessage}</Text>;
}

export default WelcomeMessage;
