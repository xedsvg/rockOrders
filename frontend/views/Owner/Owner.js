import React, { useEffect } from 'react';
import { globalState } from '../../state';

import OpenOrders from './OpenOrders'

import { baseUrl } from '../../settings';

const Owner = () => {
  const state = globalState();
  const { restaurantId } = state;

  useEffect(() => {
    (async () => {
      state.openOrders = await (await fetch(`${baseUrl}/orders/active/${restaurantId}`)).json();
    })();
  }, [])

  return (
      <OpenOrders/>
  );
}

export default Owner;