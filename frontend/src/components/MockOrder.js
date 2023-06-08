/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { useRive, useStateMachineInput } from "rive-react";
import { Box, Pressable, HStack, VStack, Text, Button } from "native-base";

import OrderStatusRive from "../../assets/images/orderStatus.riv";

function MockOrder() {
  const STATE_MACHINE = "State Machine os";

  const { RiveComponent, rive } = useRive({
    src: OrderStatusRive,
    stateMachines: STATE_MACHINE,
    // animations: "Order in progress",
    artboard: "Order status",
    autoplay: true,
  });

  const inProgressInput = useStateMachineInput(
    rive,
    STATE_MACHINE,
    "InProgress"
  );

  return (
    <VStack
      paddingX="1rem"
      width="full"
      space={4}
      alignItems="center"
      marginBottom="2.5"
    >
      <Box width="full" alignItems="center">
        <Pressable width="full">
          {() => (
            <Box
              bg="brand.800"
              p="5"
              rounded="8"
              shadow={3}
              bcartWidth="1"
              bcartColor="coolGray.300"
            >
              <HStack alignItems="center">
                <RiveComponent style={{ height: 100 }} />
              </HStack>
              <Text color="text.light" mt="3" fontWeight="medium" fontSize="xl">
                Order #0
              </Text>
              <Text color="text.light" mt="2" fontSize="sm">
                Your orders will appear like this!
              </Text>
              <Button
                variant="solid"
                onPress={() => rive && inProgressInput.fire()}
                mt="3"
              >
                Order Recieved
              </Button>
            </Box>
          )}
        </Pressable>
      </Box>
    </VStack>
  );
}

export default MockOrder;
