/* eslint-disable camelcase */
/* eslint-disable no-console */
import { Button, Image, VStack } from "native-base";
import React from "react";

import QR from "../../assets/images/qr_code.gif";
import { Socket } from "../api";
import { baseUrl } from "../settings";
import { globalState } from "../state";

function QrScan() {
  const state = globalState();

  const { developerMode, restaurantId, api } = state;

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
    <VStack space={3}>
      <Image
        style={{
          width: 270,
          height: 270,
          alignSelf: "center",
          marginBottom: 30,
        }}
        alt="qr"
        source={QR}
      />

      <Button
        onPress={() => {
          alert("Not implemented!");
        }}
      >
        Scan QR code
      </Button>

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

export default QrScan;
