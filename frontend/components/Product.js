import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, Box, Icon, Divider, Modal, Pressable, FormControl, Select, CheckIcon, WarningOutlineIcon, Center } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const Product = ({ product, addToCart, removeFromCart }) => {
  const [qty, setQty] = useState(0);
  const [showModal, setShowModal] = useState(false);

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
    contains = "",
    volume = "",
    description = "",
    variation = [],
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
      <View style={{ flexDirection: "column", flexGrow: "1", padding: 10 }}>
        <Pressable
          onPress={() => setShowModal(true)}
        >
          <Image
            source={{ uri: image }}
            style={{ width: 150, height: 150 }}
            alt={product.name}
          />
        </Pressable>
        <View
          paddingTop="1.5"
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text
            style={{
              whiteSpace: "pre-wrap",
              overflow: "hidden"
            }}
          >{name}</Text>
        </View>

        <Text fontSize="xs">{alcoholContent}</Text>
        <Text fontSize="xs" bold>
          {volume}
        </Text>

        <Divider style={{
          backgroundColor: "transparent",
          flexGrow: 1
        }}> </Divider>

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
                  size="xs"
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
                <Icon as={Ionicons} name="add" lineHeight="xs" size="sm" colorScheme="danger" />
              }
            ></Button>
          ) : null}
          <Text bold>{price} RON</Text>
        </View>
      </View>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="80%">
          <Modal.Body>
            <View>
              <Image
                source={{ uri: image }}
                style={{
                  width: "100%",
                  minHeight: "30vh",
                  objectFit: "contain"
                }}
                alt={product.name}
              />

              <View>
                <Center>
                  <Text
                    bold
                    fontSize="2xl"
                    style={{
                      whiteSpace: "pre-wrap"
                    }}>
                    {[product.name]}
                  </Text>
                </Center>

                <Divider></Divider>
                <Text>What's this: {description}</Text>
                <Text>What's inside: {contains}</Text>

                {variation.length ? (<FormControl w="3/4" maxW="300" isRequired isInvalid>
                  <Select minWidth="200" accessibilityLabel="Choose Variant" placeholder={variation.reduce((final, variation) => `${final.name || final} or ${variation.name}`)} _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />
                  }} mt="1">
                    {variation.map((variant) => (<Select.Item key={variant.name} label={variant.name} value={variant.name} />))}
                  </Select>
                  <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                    Select which variant you want!
                  </FormControl.ErrorMessage>
                </FormControl>) : null}

                <Text>Alcohol Content: {alcoholContent}</Text>
                <Text>Volume: {volume}ml</Text>

              </View>

            </View>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button onPress={() => {
                setShowModal(false);
              }}>
                Add to order
              </Button>
              <Button variant="ghost" disabled="true" colorScheme="blueGray" >
                {price} RON
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default Product;