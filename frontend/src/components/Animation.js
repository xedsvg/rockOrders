/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import { Button } from "native-base";
import React from "react";
import { useStateMachineInput } from "rive-react";

function Animation({ RiveComponent, rive, STATE_MACHINE, inputName }) {
  const input = useStateMachineInput(rive, STATE_MACHINE, inputName);

  input.fire();
  return (
    <div style={{ height: 100 }}>
      <RiveComponent style={{ height: 100 }} />
      <Button variant="solid" onPress={() => rive && input.fire()} mt="3">
        Order Recieved
      </Button>
    </div>
  );
}

export default Animation;
