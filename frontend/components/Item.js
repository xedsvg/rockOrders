// export default function Item({ item, addToOrder, removeFromOrder }) {

import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import { Button, Icon, Box } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const Product = ({ product, addToCart, removeFromCart }) => {
  const [qty, setQty] = useState(0);

  const remove = async () => {
    await removeFromCart(product);
    setQty(qty - 1);
  };

  const add = async () => {
    await addToCart(product);
    setQty(qty + 1);
  };
  let {
    id = 0,
    name = "Unavailable",
    price = "0",
    image = "https://prnewswire2-a.akamaihd.net/p/1893751/sp/189375100/thumbnail/entry_id/1_z1bkmcrb/def_height/1500/def_width/1500/version/100011/type/1",
  } = product;

  useEffect(() => {
    product.qty ? setQty(product.qty) : null;
  }, []);

  return (
    <Box
      borderWidth={1}
      borderColor="gray.300"
      borderRadius="md"
      overflow="hidden"
      minWidth="100%"
    >
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <Image
          source={{ uri: image }}
          style={{ width: 100, height: 100, marginRight: 10 }}
        />
        <View>
          <Text>
            {name} ({qty})
          </Text>
          <Text style={{ marginTop: 10 }}>{price} RON</Text>

          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
          >
            <Button
              onPress={add}
              leftIcon={
                <Icon as={Ionicons} name="cart" size="sm" color="white" />
              }
            >
              <Text
                ml={2}
                fontSize="md"
                style={{
                  color: "white",
                  textAlign: "center",
                }}
              >
                Add
              </Text>
            </Button>

            {qty ? (
              <Button
                onPress={remove}
                colorScheme="danger"
                size="sm"
                leftIcon={
                  <Icon as={Ionicons} name="remove" size="sm" color="white" />
                }
              >
                <Text
                  ml={2}
                  fontSize="md"
                  style={{
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Remove
                </Text>
              </Button>
            ) : null}
          </View>
        </View>
      </View>
    </Box>
  );
};

export default Product;
