import { View, HStack, Text } from "native-base";
import React, { useEffect, useState } from "react";

import OpenOrder from "./components/OpenOrder";
import { toastEmitter } from "../../components/Toast";
import { baseUrl } from "../../settings";
import { globalState } from "../../state";

const changeStatusHandler = async (orderId, status) => {
  const data = await fetch(`${baseUrl}/owner/orders/update/${orderId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  toastEmitter.emit("showToast", {
    id: orderId + status, // Unique ID to prevent duplicates
    title: "Order status:",
    description: `Order is now ${status}`,
  });
};

function OpenOrders() {
  const [groupedOrders, setGroupedOrders] = useState({});

  const state = globalState();
  const { openOrders, selectedTable } = state;

  // openOrders.forEach((order) => {
  //   const tableId = order.tabId.tableId._id;
  //   const localGroupedOrders = {};
  //   if (groupedOrders[tableId]) {
  //     localGroupedOrders[tableId].push(order);
  //   } else {
  //     localGroupedOrders[tableId] = [order];
  //   }
  //   setGroupedOrders({ ...groupedOrders, ...localGroupedOrders });
  // });

  // const sortedOrders = Object.values(groupedOrders).flatMap((orders) =>
  //   orders.sort((a, b) =>
  //     a.tabId.tableId._id.localeCompare(b.tabId.tableId._id)
  //   )
  // );

  useEffect(() => {
    if (selectedTable) {
      openOrders.filter(
        (order) => order.tabId.tableId._id === selectedTable._id
      );
    }
  }, [selectedTable]);

  return (
    <View>
      <Text color="text.light" fontSize="xl" fontWeight="bold" mb={3}>
        Open Orders {selectedTable && `for Table #${selectedTable.tableNo}`}
      </Text>
      <HStack flexWrap="wrap" width="100%">
        {openOrders.map((order, index) => (
          <OpenOrder
            mb={3}
            key={order._id}
            order={order}
            index={index}
            style={{
              flexBasis: `20%`,
              flexShrink: 1,
            }}
          />
        ))}
      </HStack>
    </View>
  );
}

export default OpenOrders;
