/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
/* eslint-disable no-console */

import Rive from "@rive-app/react-canvas";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera, CameraType } from "expo-camera";
import { Button, VStack, Text, View, Heading, Pressable } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import Animation from "../../assets/images/tabley.riv";
import { Socket } from "../api";
import { baseUrl } from "../settings";
import { globalState } from "../state";

function QrScan() {
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraView, setCameraView] = useState(null);

  const state = globalState();

  const { developerMode, restaurantId, api } = state;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setCameraView(false);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  const goToTableHandler = async () => {
    state.tableInfo = await api.getTableInfo(state.tableId);

    const socket = new Socket(
      null,
      restaurantId,
      false,
      state.tableInfo.currentTab._id
    );
    // move this shit into api-socket something

    socket.on("order:new", (data) => {
      console.log("new order on tab");
      state.addOrder(data.order);
    });

    socket.on("order:update", (data) => {
      console.log("update order on tab");
      state.updateOrderStatus(data.id, data.status);
    });

    socket.on("tab:closed", (data) => {
      console.log("tab: closed");
    });

    state.socketIo = socket;
    state.currentView = "table";
  };

  const dev_getRandomTable = async () => {
    const response = await fetch(
      `${baseUrl}/user/getRandomTable/${restaurantId}`
    );
    const { _id } = await response.json();
    state.tableId = _id;
    goToTableHandler();
  };

  return (
    <VStack space={3} flex={1} alignItems="center">
      <VStack
        marginTop="12vh"
        alignItems="center"
        paddingX="20vw"
        textAlign="center"
        marginBottom="5vh"
      >
        <Heading bold color="text.light" lineHeight="2.25em">
          TAP TO SCAN
        </Heading>
        <Text color="text.light">
          The app will require access to your camera
        </Text>
      </VStack>
      {!cameraView ? (
        <Pressable onPress={() => dev_getRandomTable()}>
          <Rive
            src={Animation}
            autoPlay
            style={{
              width: 270,
              height: 270,
            }}
          />
        </Pressable>
      ) : (
        <View style={styles.container}>
          <Camera
            style={[StyleSheet.absoluteFillObject, styles.container]}
            onBarCodeScanned={handleBarCodeScanned}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
          />
        </View>
      )}

      {/* <Button onPress={() => setCameraView(true)}>Scan QR code</Button> */}

      {hasPermission === null ? (
        <Text>Requesting for camera permission</Text>
      ) : null}

      {hasPermission === false ? <Text>No access to camera</Text> : null}

      {developerMode && (
        <Button
          style={{
            marginBottom: 40,
            color: "white",
            textAlign: "center",
          }}
          onPress={dev_getRandomTable}
        >
          (Development Mode) Go to Table
        </Button>
      )}
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    flexDirection: "column",
    minWidth: 270,
    minHeight: 270,
    alignSelf: "center",
  },
});

export default QrScan;
