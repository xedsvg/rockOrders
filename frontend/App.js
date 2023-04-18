import React, { useEffect } from "react";

import { globalState } from "./state";
import { Api } from "./api";

import { View, NativeBaseProvider, VStack, useDisclose, Button } from "native-base";

import { theme } from "./theme";

import Navbar from "./components/Navbar";
import QrScan from "./views/QrScan";
import Table from "./views/Table";
import Menu from "./views/Menu";

import Owner from "./views/Owner/Owner";

export default function App() {
  const state = globalState();
  const { user, currentView } = state;
  const { isOpen, onOpen, onClose } = useDisclose();


  useEffect(() => {
    (async () => {
      state.api = new Api();
      const { restaurantId, restaurantName } = await state.api.getSettings();
      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;
    })();
  }, []);

  return (
    <NativeBaseProvider theme={theme}>
      <VStack flex={1} space={2} alignItems="center" bg="brand.800">

        <Navbar onOpen={onOpen} />

        <View flex={1} minWidth="full" padding="3vw" borderTopRadius={25} zIndex={1} top="-4vh" background="paper.medium">
          {currentView === "scan"  && user == "customer" && <QrScan />}
          {currentView === "menu"  && user == "customer" && <Menu  isOpen={isOpen} onClose={onClose}/>}
          {currentView === "table" && user == "customer" && <Table isOpen={isOpen} onClose={onClose}/>}

          {user == "owner" && <Owner />}
          {user == "customer" && <Button onPress={() => state.user = "owner"}> Owner view </Button>}
        </View>
      </VStack>
    </NativeBaseProvider>
  );
}