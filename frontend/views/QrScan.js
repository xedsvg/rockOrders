import React, { useEffect, useState } from "react";
import { Text, View, Button, Image, Input, VStack } from "native-base";

export default function QrScan({ GoToTableHandler, LoginButtonHandler, tableId, setTableId, restaurantId }) {

  const grabRandomTable = async () => {
    const response = await fetch(
      `http://localhost:3000/getRandomTable/${restaurantId}`
    );
    const data = await response.json();
    setTableId(data._id);
  };

  useEffect(() => {
    grabRandomTable();
  }, [restaurantId]);

  return (
    <VStack space={3}>
      <Image
        style={{
          width: 270,
          height: 270,
          alignSelf: "center",
          marginBottom: 30,
        }}
        alt="qr"
        source={require("../assets/images/qr_code.gif")}
      />

      <Button
        onPress={null}
      >
        Scan QR code
      </Button>

      {tableId ? (
        <Button
          style={{
            marginBottom: 40,
            color: "white",
                textAlign: "center",
          }}
          onPress={() => {
            GoToTableHandler(tableId);
          }}
        >
              Go to Table
        </Button>
      ) : null}

      {location.hostname === "hlocalhost" ? (
        <>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "black",
              marginHorizontal: 50,
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              color: "red",
              textAlign: "center",
            }}
          >
            For Shop owner use only*
          </Text>

          <Input
            style={{
              height: 40,
              backgroundColor: "white",
              color: "black",
              borderWidth: 1,
              borderColor: "#D1D1D1",
              borderRadius: 5,
              padding: 10,
              marginTop: 28,
              //
              fontSize: 14,
              marginHorizontal: 10,
            }}
            placeholder="Owner password"
            // value={" "}
            onChangeText={(text) => setRestaurantId(text)}
          />
          {/* Shop ID Button */}
          <TouchableOpacity
            style={{
              paddingTop: 10,
              marginTop: 20,
              marginBottom: 20,
              margin: 10,
            }}
            onPress={() => {
              LoginButtonHandler(restaurantId);
            }}
          >
            <View
              style={{
                backgroundColor: "gray",
                padding: 12,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                }}
              >
                Login Owner
              </Text>
            </View>
          </TouchableOpacity>
        </>
      ) : null}
    </VStack>
  );
}
