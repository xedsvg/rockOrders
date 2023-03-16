import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, Box, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const Product = ({ product, addToCart, removeFromCart }) => {
  const [qty, setQty] = useState(0);
  // const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    product.qty ? setQty(product.qty) : null;
  }, []);

  const decrement = async () => {
    await removeFromCart(product);
    setQty(qty - 1);
  };
  const add = async () => {
    await addToCart(product);
    setQty(qty + 1);
  };
  const increment = add;
  const {
    id = 0,
    name = "Unavailable",
    price = "0",
    alcoholContent = "",
    volume = "",
    image = "https://rocknrolla.ro/images/rnr-placeholder.jpg",
  } = product;

  const extraDetails = alcoholContent || volume ? true : false;

  return (
    <Box
      borderWidth={1}
      borderColor="gray.300"
      borderRadius="md"
      overflow="hidden"
      maxWidth="43%"
      marginBottom="2.5"
    >
      <View style={{ flexDirection: "column", padding: 10 }}>
        <Image
          source={{ uri: image }}
          style={{ width: 150, height: 150 }}
          alt={product.name}
        />

        <View
          paddingTop="1.5"
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text>{name}</Text>
        </View>

        <Text fontSize="xs">{alcoholContent}</Text>
        <Text fontSize="xs" bold>
          {volume}
        </Text>

        <View
          paddingTop="1.5"
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {!qty ? (
            <Button
              borderRadius="full"
              onPress={add}
              paddingTop="1"
              paddingBottom="1"
            >
              <Text bold fontSize="xs" lineHeight="sm" color="white">
                ADD
              </Text>
            </Button>
          ) : null}

          {qty ? (
            <Button
              borderRadius="full"
              colorScheme="danger"
              variant="outline"
              onPress={decrement}
              leftIcon={
                <Icon
                  as={Ionicons}
                  name="remove"
                  lineHeight="sm"
                  size="sm"
                  colorScheme="danger"
                />
              }
            ></Button>
          ) : null}

          {qty ? <Text>{qty}</Text> : null}

          {qty ? (
            <Button
              borderRadius="full"
              colorScheme="danger"
              variant="outline"
              onPress={increment}
              leftIcon={
                <Icon as={Ionicons} name="add" lineHeight="sm" size="sm" colorScheme="danger" />
              }
            ></Button>
          ) : null}
          <Text bold>{price} RON</Text>
        </View>
      </View>
    </Box>
  );
};

export default Product;
