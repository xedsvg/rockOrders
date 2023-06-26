import { Center } from "native-base";
import React from "react";

// import Cart from "../components/Cart";
import MockOrder from "../components/MockOrder";
import Order from "../components/Order";
import TableStatus from "../components/TableStatus";
import { globalState } from "../state";

const Table = () => {
  const state = globalState();

  return [
    <Center key="tStatusUniqueKey">
      <TableStatus />
    </Center>,
    // state.totalProducts ? <Cart /> : null,
    state.orders.length
      ? state.orders.map((order, orderNr) => (
          <Order
            key={order._id}
            orderNr={state.orders.length - orderNr}
            order={order}
          />
        ))
      : null,
    !state.orders.length && !state.totalProducts ? (
      <MockOrder key="abracadabra" />
    ) : null,
  ];
};

export default Table;
