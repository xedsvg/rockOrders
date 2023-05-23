import React, { useEffect } from "react";

import { globalState } from "./state";
import { Api } from "./api";

import { NativeBaseProvider, VStack, useDisclose, Button, ScrollView, Container } from "native-base";

import { theme } from "./theme";

import Navbar from "./components/Navbar";
import ActionView from "./components/ActionView";
import QrScan from "./views/QrScan";
import Table from "./views/Table";
import Categories from "./views/Categories";
import Products from "./views/Products";

import Owner from "./views/Owner/Owner";
import { ToastManager, toastEmitter } from "./components/Toast";
import { SlideManager } from "./components/Slider";

export default function App() {
  const state = globalState();
  const { user, currentView } = state;
  const { isOpen, onOpen, onClose } = useDisclose();

  useEffect(() => {
    (async () => {

      state.api = new Api((msg) => toastEmitter.emit('showToast', msg));
      const { restaurantId, restaurantName } = await state.api.getSettings();
      state.products = await state.api.getMenu(restaurantId);
      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;
    })();
  }, []);

  return (
    <NativeBaseProvider theme={theme}>
      <Container flex={1}>
        <VStack flex={1} space={2} alignItems="center" bg="brand.800" width="100vw">
          <Navbar onOpen={onOpen} />
          <ScrollView w="full" overflow="scroll" height="80vh" padding="5vw" borderRadius={25} zIndex={1} top="-4vh" background="paper.medium" >

            {/* <View flex={1} padding="3vw" borderTopRadius={25} zIndex={1} top="-4vh" background="paper.medium"> */}
            {currentView === "scan" && user == "customer" && <QrScan />}
            {currentView === "categories" && user == "customer" && <Categories />}
            {currentView === "products" && user == "customer" && <Products />}
            {currentView === "table" && user == "customer" && <Table />}

            <ActionView isOpen={isOpen} onClose={onClose} />

            {user == "owner" && <Owner />}
            {user == "customer" && <Button onPress={() => state.user = "owner"}> Owner view </Button>}

            {/* </View> */}
          </ScrollView>
        </VStack>
      </Container>
      <ToastManager />
      <SlideManager />
    </NativeBaseProvider>
  );
}