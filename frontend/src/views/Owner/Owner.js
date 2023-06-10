import { View, Button, HStack, useDisclose } from "native-base";
import React, { useEffect } from "react";

import OpenOrders from "./OpenOrders";
import Tables from "./Tables";
import OwnerActionView from "./components/OwnerActionView";
import { Socket } from "../../api";
import { toastEmitter } from "../../components/Toast";
import { globalState } from "../../state";

function Owner() {
  const state = globalState();
  const { restaurantId, api, ownerView } = state;
  const { isOpen, onOpen, onClose } = useDisclose();
  state.ownerActionViewIsOpen = isOpen;

  useEffect(() => {
    (async () => {
      state.openOrders = await api.getOpenOrders(restaurantId);
      state.tables = await api.getTables(restaurantId);
      // this is a hack to not have to await the writing of the socketIo object to the state

      const socket = new Socket(null, restaurantId, true);
      // when loading the orders, check if there is a call waiter set in the database and show the notification
      socket.on("order:new", (data) => {
        state.pushNewOrder(data.order);
      });

      socket.on("order:update", (data) => {
        state.updateOpenOrderStatus(data.id, data.status);
      });

      socket.on("waiter:notification", (data) => {
        const { tableNo, tabId } = data;

        toastEmitter.emit("showToastWithDismiss", {
          id: tabId,
          title: `Table ${tableNo} called for a waiter`,
          dismissCallback: async () => {
            await api.clearCallWaiter(tabId);
          },
        });
      });

      socket.on("tab:closed", (data) => {
        console.log("tab: closed");
        state.removeActiveTable(data.tableId);
      });

      socket.on("tab:open", async (data) => {
        console.log("tab: open");
        const table = await api.getTable(data.tableId);
        state.setActiveTable(table);
      });

      state.socketIo = socket;
    })();
  }, []);

  return (
    <View bg="paper.medium" p="1rem">
      <HStack
        space={2}
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Button onPress={() => (state.ownerView = "tables")}> Tables </Button>
        <Button onPress={() => (state.ownerView = "orders")}> Orders </Button>
        <Button
          disabled
          bg="rgb(46, 46, 46)"
          onPress={() => (state.ownerActionViewIsOpen = true)}
        >
          Settings
        </Button>
      </HStack>

      {ownerView === "orders" && <OpenOrders />}
      {ownerView === "tables" && <Tables />}

      <OwnerActionView isOpen={isOpen} onClose={onClose} />
    </View>
  );
}

export default Owner;
