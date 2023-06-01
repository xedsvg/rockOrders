import {
  NativeBaseProvider,
  VStack,
  useDisclose,
  Button,
  ScrollView,
  Container,
} from "native-base";
import React, { useEffect } from "react";

import { Api } from "./api";
import CartActionView from "./components/CartActionView";
import ItemActionView from "./components/ItemActionView";
import Navbar from "./components/Navbar";
import { SlideManager } from "./components/Slider";
import { ToastManager, toastEmitter } from "./components/Toast";
import { globalState } from "./state";
import { theme } from "./theme";
import Categories from "./views/Categories";
import Owner from "./views/Owner/Owner";
import Products from "./views/Products";
import QrScan from "./views/QrScan";
import Table from "./views/Table";

export default function App() {
  const state = globalState();
  const { user, currentView } = state;

  const {
    isOpen: cartIsOpen,
    onOpen: cartOnOpen,
    onClose: cartOnClose,
  } = useDisclose();

  useEffect(() => {
    (async () => {
      state.api = new Api((msg) => toastEmitter.emit("showToast", msg));
      const { restaurantId, restaurantName } = await state.api.getSettings();
      state.products = await state.api.getMenu(restaurantId);
      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;
    })();
  }, []);

  return (
    <NativeBaseProvider theme={theme}>
      <Container flex={1}>
        <VStack
          flex={1}
          space={2}
          alignItems="center"
          bg="brand.800"
          width="100vw"
        >
          <Navbar onOpen={cartOnOpen} />
          <ScrollView
            w="full"
            overflow="scroll"
            height="80vh"
            paddingX="5vw"
            borderRadius={25}
            zIndex={1}
            top="-4vh"
            bg="paper.medium"
          >
            {/* <View flex={1} padding="3vw" borderTopRadius={25} zIndex={1} top="-4vh" background="paper.medium"> */}
            {currentView === "scan" && user === "customer" && <QrScan />}
            {currentView === "categories" && user === "customer" && (
              <Categories />
            )}
            {currentView === "products" && user === "customer" && <Products />}
            {currentView === "table" && user === "customer" && <Table />}

            {state.currentProduct ? <ItemActionView /> : null}
            <CartActionView isOpen={cartIsOpen} onClose={cartOnClose} />

            {user === "owner" && <Owner />}
            {user === "customer" && (
              <Button onPress={() => (state.user = "owner")}>Owner view</Button>
            )}

            {/* </View> */}
          </ScrollView>
        </VStack>
      </Container>
      <ToastManager />
      <SlideManager />
    </NativeBaseProvider>
  );
}
