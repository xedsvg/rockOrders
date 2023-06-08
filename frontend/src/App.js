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
import Logo from "./components/Logo";
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
  const { user, currentView, developerMode } = state;

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
        <VStack flex={1} alignItems="center" bg="brand.800" width="100vw">
          <Logo />
          <ScrollView
            w="full"
            overflow="scroll"
            height="80vh"
            borderTopRadius={25}
            borderTopColor="#352A57"
            borderTopWidth={6}
            zIndex={1}
            bg="paper.medium"
          >
            {currentView === "scan" && user === "customer" && <QrScan />}
            {currentView === "categories" && user === "customer" && (
              <Categories />
            )}
            {currentView === "products" && user === "customer" && <Products />}
            {currentView === "table" && user === "customer" && <Table />}

            {state.currentProduct ? <ItemActionView /> : null}
            {cartIsOpen && (
              <CartActionView isOpen={cartIsOpen} onClose={cartOnClose} />
            )}

            {user === "owner" && <Owner />}
            {developerMode && user === "customer" && (
              <Button onPress={() => (state.user = "owner")}>Owner view</Button>
            )}
          </ScrollView>
          <Navbar onOpen={cartOnOpen} />
        </VStack>
      </Container>
      <ToastManager />
      <SlideManager />
    </NativeBaseProvider>
  );
}
