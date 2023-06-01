import { View, HStack, Text } from "native-base";
import React from "react";

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
  const state = globalState();
  const { openOrders, selectedTable } = state;

  const groupedOrders = {};

  openOrders.forEach((order) => {
    const tableId = order.tabId.tableId._id;
    if (groupedOrders[tableId]) {
      groupedOrders[tableId].push(order);
    } else {
      groupedOrders[tableId] = [order];
    }
  });

  const sortedOrders = Object.values(groupedOrders).flatMap((orders) =>
    orders.sort((a, b) =>
      a.tabId.tableId._id.localeCompare(b.tabId.tableId._id)
    )
  );

  return (
    <View>
      <Text color="text.light" fontSize="xl" fontWeight="bold" mb={3}>
        Open Orders
      </Text>
      {/* {selectedTable
                ? ( */}
      <HStack flexWrap="wrap" width="100%">
        {sortedOrders.map((item, index) => (
          <OpenOrder
            mb={3}
            item={item}
            index={index}
            style={{
              flexBasis: `${100 / Math.min(sortedOrders.length, 5)}%`,
            }}
          />
        ))}
      </HStack>
      {/* ) : (
                    <ZStack style={{
                        ...styles.orders,
                        flexBasis: `${100 / Math.min(sortedOrders.length, 5)}%`,
                    }} >
                        {sortedOrders.map((item, index) => renderOrder(item, index, state))}
                    </ZStack>
                )} */}
    </View>
  );
}

export default OpenOrders;
