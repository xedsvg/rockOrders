import React from "react";

import { Box, Pressable, Badge, HStack, VStack, Spacer, Text} from "native-base";


export default function Order({}) {

  return (
    <VStack space={4} alignItems="center">
            <Box alignItems="center">
              <Pressable maxW="96">
                {({ isHovered, isPressed }) => {
                  return (
                    <Box
                      bg={
                        isPressed
                          ? "coolGray.200"
                          : isHovered
                          ? "coolGray.200"
                          : "coolGray.100"
                      }
                      style={{
                        transform: [
                          {
                            scale: isPressed ? 0.96 : 1,
                          },
                        ],
                      }}
                      p="5"
                      rounded="8"
                      shadow={3}
                      borderWidth="1"
                      borderColor="coolGray.300"
                    >
                      <HStack alignItems="center">
                        <Badge
                          colorScheme="green"
                          _text={{
                            color: "white",
                          }}
                          variant="solid"
                          rounded="4"
                        >
                          Done!
                        </Badge>
                        <Spacer />
                        <Text fontSize={10} color="coolGray.800">
                          5 minutes ago
                        </Text>
                      </HStack>
                      <Text
                        color="coolGray.800"
                        mt="3"
                        fontWeight="medium"
                        fontSize="xl"
                      >
                        Order nr #0
                      </Text>
                      <Text mt="2" fontSize="sm" color="coolGray.700">
                        Details: Press me for more actions!
                      </Text>
                      
                    </Box>
                  );
                }}
              </Pressable>
            </Box>
            
          </VStack>
  );
}
