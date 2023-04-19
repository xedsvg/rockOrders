import React, { useEffect } from "react";
import { Center } from "native-base";

import TableStatus from "../components/TableStatus";
import Cart from "../components/Cart";
import Order from "../components/Order";
import MockOrder from "../components/MockOrder";

import { globalState } from "../state";

const Table = () => {
  const state = globalState();

  useEffect(() => {
    state.cartOrTab = "View Tab";
  }, [state.cart]);

  return [
    <Center> <TableStatus /> </Center>,
    state.totalProducts ? <Cart /> : null,
    state.orders.length ? state.orders.map((order, orderNr) => { return (<Order key={order._id} orderNr={orderNr} order={order} />) }) : null,
    (!state.orders.length && !state.totalProducts) ? <MockOrder /> : null
  ]
    ;
}

export default Table;