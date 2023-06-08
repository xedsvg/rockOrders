/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-extraneous-dependencies */
import { MaterialIcons } from "@expo/vector-icons";
import {
  Radio,
  IconButton,
  Image,
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
import React, { useState, useEffect } from "react";

import { globalState } from "../state";

function ItemActionView() {
  const state = globalState();
  const { currentProduct: product = {} } = state;
  const [prodQty, setQty] = useState(1);
  const [value, setValue] = React.useState(-1);
  const [price, setPrice] = React.useState(0);
  const [buttonText, setButtonText] = React.useState("Add to cart");

  const addToCartOrUpdate = () => {
    if (product?.cartQty) {
      state.cartFunctions.update(prodQty);
    } else {
      if (product?.type === "product") {
        state.cartFunctions.add(prodQty);
      }
      if (product?.type === "variation") {
        state.cartFunctions.add(prodQty, value);
      }
    }

    state.removeCurrentProduct();
    setQty(1);
    setValue(-1);
  };

  useEffect(() => {
    if (product?.cartQty) {
      setQty(product?.cartQty);
      if (product?.type === "variation") setValue(0);
    }
  }, []);

  useEffect(() => {
    if (product?.type === "variation") {
      setPrice(product?.recipe?.find(() => true)?.price);
    } else {
      setPrice(product?.price);
    }
  }, [product]);

  useEffect(() => {
    if (product.cartQty && prodQty === 0) {
      setButtonText("Remove from cart");
    } else if (product.cartQty && prodQty >= 1) {
      setButtonText("Update cart");
    } else if (!product?.active) {
      setButtonText("Out of stock");
    } else if (product?.type === "product") {
      setButtonText(`Add to cart (${price * prodQty} ${product?.currency})`);
    } else if (product?.type === "variation" && value > -1) {
      setButtonText(
        `Add to cart (${price * prodQty} ${product?.recipe[value]?.currency})`
      );
    } else if (product?.type === "variation" && value === -1) {
      setButtonText(`Select an option`);
    }
  }, [prodQty, product, value]);

  return (
    <Center>
      <Actionsheet
        isOpen={state.currentProduct}
        onClose={state.removeCurrentProduct}
        variant="item"
        p="0"
      >
        <Actionsheet.Content p="0">
          <Box w="100%" justifyContent="center">
            <Image
              source={{ uri: "https://i.imgur.com/2nCt3Sbl.jpg" }}
              alt="image base"
              resizeMode="cover"
              height={150}
              roundedTop="xl"
            />
            <VStack space={3} mx={5} marginTop={5}>
              <HStack justifyContent="space-between" alignItems="start">
                <Heading flexGrow={1} size="md" color="text.light">
                  {product?.name} {!product?.active ? "(out of stock)" : null}
                </Heading>
                <VStack flexShrink={1}>
                  <Text color="text.light">
                    {product?.type !== "variation"
                      ? `${product?.price} ${product?.currency}`
                      : `Starting at ${
                          product?.recipe?.find(() => true)?.price
                        } ${product?.recipe?.find(() => true)?.currency} `}
                  </Text>
                  <Text color="text.light">
                    {product?.qty && product?.measureUnit
                      ? `${product?.qty} ${product?.measureUnit}`
                      : null}
                  </Text>
                </VStack>
              </HStack>
              <Text color="text.light">{product?.description}</Text>
              {product?.type === "variation" ? (
                <Radio.Group
                  w="100%"
                  accessibilityLabel="select variation"
                  value={value}
                  onChange={(nextValue) => {
                    setValue(nextValue);
                    setPrice(product?.recipe[nextValue].price);
                  }}
                >
                  {product?.recipe.map((recipeItem, index) => (
                    <Radio
                      colorScheme="warning"
                      key={recipeItem._id}
                      value={index}
                      my={1}
                      w="100%"
                    >
                      <HStack
                        space={2}
                        alignItems="center"
                        justifyContent="space-between"
                        w="100%"
                      >
                        <Text color="text.light">{recipeItem.name}</Text>
                        <Text color="text.light">
                          {recipeItem.price} {recipeItem.currency}
                        </Text>
                      </HStack>
                    </Radio>
                  ))}
                </Radio.Group>
              ) : null}
              {product?.active ? (
                <Divider bg="transparent" thickness={2} />
              ) : null}
            </VStack>
            <HStack space={2} px={5} py={3}>
              <Button
                disabled={!product?.active && !product?.cartQty}
                flexGrow={1}
                onPress={addToCartOrUpdate}
                my={2}
              >
                {buttonText}
              </Button>
              {product?.active ? (
                <Button variant="outline" p={0} my={2}>
                  <HStack>
                    <IconButton
                      disabled={
                        (!product.cartQty && prodQty <= 1) ||
                        (product.cartQty && prodQty <= 0)
                      }
                      mx={2}
                      size="lg"
                      p={0}
                      key="-"
                      variant="ghost"
                      _icon={{
                        as: MaterialIcons,
                        name: "remove",
                        color: "text.light",
                      }}
                      onPress={() => setQty(prodQty - 1)}
                    />
                    <Text mx={2} color="text.light">
                      {" "}
                      {prodQty}{" "}
                    </Text>
                    <IconButton
                      mx={2}
                      size="lg"
                      p={0}
                      key="+"
                      variant="ghost"
                      _icon={{
                        as: MaterialIcons,
                        name: "add",
                        color: "text.light",
                      }}
                      onPress={() => setQty(prodQty + 1)}
                    />
                  </HStack>
                </Button>
              ) : null}
            </HStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </Center>
  );
}

export default ItemActionView;
