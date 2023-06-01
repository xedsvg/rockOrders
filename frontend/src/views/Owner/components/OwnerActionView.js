import {
  Actionsheet,
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from "native-base";
import React from "react";

import { globalState } from "../../../state";

function OwnerActionView({ onClose }) {
  const state = globalState();

  return (
    <Center>
      <Actionsheet isOpen={state.ownerActionViewIsOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w={["250", "300"]} justifyContent="center">
            <VStack alignItems="center" justifyContent="center">
              <Heading>Table 1</Heading>
            </VStack>
          </Box>
          <HStack w="100%" px={10} justifyContent="space-between">
            <HStack w="100%" justifyContent="space-between" alignItems="start">
              <VStack
                alignItems="center"
                justifyContent="center"
                flexGrow={1}
                m={5}
              >
                <Heading>Close table</Heading>
                <Divider my="2" />
                <Button
                  m={5}
                  flexGrow={1}
                  w="100%"
                  onPress={() => {
                    onClose();
                  }}
                  my="2"
                >
                  Card
                </Button>
                <Button
                  m={5}
                  flexGrow={1}
                  w="100%"
                  onPress={() => {
                    onClose();
                  }}
                  my="2"
                >
                  Cash
                </Button>
                <Button
                  m={5}
                  flexGrow={1}
                  w="100%"
                  onPress={() => {
                    onClose();
                  }}
                  my="2"
                >
                  Cash&Card
                </Button>
              </VStack>

              <VStack
                alignItems="center"
                justifyContent="center"
                flexGrow={1}
                m={5}
              >
                <Heading>Table Actions</Heading>
                <Divider my="2" />
                <Button
                  m={5}
                  flexGrow={1}
                  w="100%"
                  onPress={() => {
                    onClose();
                  }}
                  my="2"
                >
                  Join Tables
                </Button>
              </VStack>

              <VStack
                alignItems="center"
                justifyContent="center"
                flexGrow={1}
                m={5}
              >
                <Heading>Tab Actions</Heading>
                <Divider my="2" />
                <Button
                  m={5}
                  flexGrow={1}
                  w="100%"
                  onPress={() => {
                    onClose();
                  }}
                  my="2"
                >
                  Add order
                </Button>
                <Button
                  m={5}
                  flexGrow={1}
                  w="100%"
                  onPress={() => {
                    onClose();
                  }}
                  my="2"
                >
                  Reset Pin
                </Button>
              </VStack>
            </HStack>
          </HStack>
        </Actionsheet.Content>
      </Actionsheet>
    </Center>
  );
}

export default OwnerActionView;
