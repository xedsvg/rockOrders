import { EventEmitter } from "events";
import { Slide, Box } from "native-base";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";

export const slideEmitter = new EventEmitter();

export function SlideManager() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    slideEmitter.on("toggleSlider", () => {
      setIsOpen(!isOpen);
    });

    return () => {
      slideEmitter.removeAllListeners("showSlider");
    };
  }, []);

  return (
    <Slide in={isOpen} placement="bottom">
      <SafeAreaView>
        <Box
          bottom="50"
          top={0}
          left={0}
          p="2"
          _text={{
            color: "orange.600",
          }}
          bg="orange.200"
        >
          Warning: This is a warning. Your account is about to expire.
        </Box>
      </SafeAreaView>
    </Slide>
  );
}
