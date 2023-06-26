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

  const setRestaurantDetails = async ({
    restaurantName,
    restaurantHostname,
  }) => {
    if (restaurantName) {
      const restaurant = await state.api.getRestaurantByName(restaurantName);
      if (restaurant) {
        state.restaurantId = restaurant.restaurantId;
        state.restaurantName = restaurant.restaurantName;
        state.products = await state.api.getMenu(restaurant.restaurantId);
      } else {
        alert(
          "2. Sorry but the url is not valid. Please scan a QR code or use the link provided by the restaurant."
        );
      }
    } else if (restaurantHostname) {
      const restaurant = await state.api.getRestaurantByHostname(
        restaurantHostname
      );
      if (restaurant) {
        state.restaurantId = restaurant.restaurantId;
        state.restaurantName = restaurant.restaurantName;
        state.products = await state.api.getMenu(restaurant.restaurantId);
      } else {
        alert(
          "3. Sorry but the url is not valid. Please scan a QR code or use the link provided by the restaurant."
        );
      }
    }
  };

  useEffect(() => {
    (async () => {
      state.api = new Api((msg) => toastEmitter.emit("showToast", msg));
      try {
        const url = new URL(window.location);
        // if (url.hostname === "localhost") state.developerMode = true;

        if (url.hostname === "tabley.app" || url.hostname === "localhost") {
          if (
            url.pathname.startsWith("/@") &&
            url.pathname.endsWith("/restaurant-view")
          ) {
            let restaurantName = url.pathname
              .replace("/restaurant-view", "")
              .toLowerCase();
            restaurantName = restaurantName.replace("/@", "");
            await setRestaurantDetails({ restaurantName });
            state.user = "owner";
          } else if (url.pathname.startsWith("/@")) {
            const restaurantName = url.pathname.replace("/@", "").toLowerCase();
            await setRestaurantDetails({ restaurantName });
          }
        } else {
          await setRestaurantDetails({
            restaurantHostname: url.hostname,
          });
        }
      } catch (e) {
        alert(
          "4: Sorry but you can't access this page directly. Please scan a QR code or use the link provided by the restaurant."
        );
      }
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
            {developerMode && user === "customer" && currentView === "scan" && (
              <Button onPress={() => (state.user = "owner")}>Owner view</Button>
            )}
          </ScrollView>
          {user !== "owner" && <Navbar onOpen={cartOnOpen} />}
        </VStack>
      </Container>
      <ToastManager />
      <SlideManager />
    </NativeBaseProvider>
  );
}
