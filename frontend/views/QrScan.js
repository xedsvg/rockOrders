import { baseUrl } from "../settings";

import React from "react";

import { Button, Image, VStack } from "native-base";
import { globalState } from "../state";


const QrScan = () => {
  const state = globalState();

  const { developerMode, restaurantId, api } = state;

  const goToTableHandler = async () => {
    state.tableInfo = await api.getTableInfo(state.tableId);
    state.currentView = 'table';

  };

  const dev_getRandomTable = async () => {
    const response = await fetch(`${baseUrl}/getRandomTable/${restaurantId}`);
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
        source={require("../assets/images/qr_code.gif")}
      />

      <Button
        onPress={() => { alert("Not implemented!"); }}
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