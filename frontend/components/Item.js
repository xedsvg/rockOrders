import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, Box, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const Product = ({ product, addToCart, removeFromCart }) => {
  const [qty, setQty] = useState(0);

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
    image = "https://prnewswire2-a.akamaihd.net/p/1893751/sp/189375100/thumbnail/entry_id/1_z1bkmcrb/def_height/1500/def_width/1500/version/100011/type/1",
  } = product;

  return (
    <Box
      borderWidth={1}
      borderColor="gray.300"
      borderRadius="md"
      overflow="hidden"
      maxWidth="45%"
      marginBottom="2.5"
    >
      <View
        style={{ flexDirection: "column", alignItems: "center", padding: 10 }}
      >
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
          <Text bold>{price} RON</Text>
        </View>

        {/* Not Added */}
        {!qty ? (
          <View>
            <View
              paddingTop="1.5"
              style={{ flexDirection: "row", alignItems: "center" }}
            >
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
            </View>
          </View>
        ) : null}

        {/* Added  */}
        {qty ? (
          <View
            paddingTop="1.5"
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              borderRadius="full"
              paddingTop="1"
              paddingBottom="1"
              colorScheme="danger"
              variant="outline"
              onPress={decrement}
              leftIcon={
                <Icon
                  as={Ionicons}
                  name="remove"
                  size="sm"
                  colorScheme="danger"
                />
              }
            ></Button>

            <Text>{qty}</Text>

            <Button
              borderRadius="full"
              paddingTop="1"
              paddingBottom="1"
              colorScheme="danger"
              variant="outline"
              onPress={increment}
              leftIcon={
                <Icon as={Ionicons} name="add" size="sm" colorScheme="danger" />
              }
            ></Button>
          </View>
        ) : null}
      </View>
    </Box>
  );
};

export default Product;
