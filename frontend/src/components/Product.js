/* eslint-disable react/prop-types */
import {
  Pressable,
  Box,
  HStack,
  Avatar,
  VStack,
  Text,
  Spacer,
} from "native-base";
import React from "react";

import { globalState } from "../state";

function Product({ product }) {
  const state = globalState();
  return (
    <Pressable onPress={() => (state.currentProduct = product)}>
      <Box
        borderBottomWidth="1"
        borderColor="muted.800"
        pl={["0", "4"]}
        pr={["0", "5"]}
        py="2"
      >
        <HStack space={[2, 3]} justifyContent="space-between">
          <Avatar
            size="lg"
            source={{
              uri:
                product.image ||
                "https://media.tenor.com/Zg8rULojSnoAAAAC/sharpening-knife.gif",
            }}
          />
          <VStack maxWidth="59%">
            <Text
              color="text.light"
              bold
              style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
              overflow="hidden"
            >
              {product.name}
            </Text>
            {product.alcoholContent ? (
              <Text color="text.light">{product.alcoholContent}</Text>
            ) : null}

            {product.description ? (
              <Text
                color="text.light"
                fontSize="xs"
                style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                overflow="hidden"
              >
                {product.description}
              </Text>
            ) : null}
          </VStack>
          <Spacer />
          <VStack>
            <Text fontSize="xs" color="text.light" alignSelf="flex-start">
              {product.type === "product"
                ? `${product.price} ${product.currency}`
                : `${product.recipe[0].price} ${product.recipe[0].currency}`}
            </Text>
            <Text fontSize="xs" color="text.light" alignSelf="flex-end">
              {product.type === "product"
                ? `${product.qty} ${product.measureUnit}`
                : `${product.recipe[0].qty} ${product.recipe[0].measureUnit}`}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );
}

export default Product;
