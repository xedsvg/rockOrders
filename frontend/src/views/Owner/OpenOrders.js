import React from "react";

import { Text, View, Button, Pressable } from "native-base";
import { StyleSheet } from "react-native";
import OpenOrder from "./components/OpenOrder";

import { globalState } from '../../state';
import { toastEmitter } from '../../components/Toast';

import { baseUrl } from '../../settings';


const changeStatusHandler = async (orderId, status) => {
    const data = await fetch(`${baseUrl}/owner/orders/update/${orderId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: status })
    });

    toastEmitter.emit('showToast', {
        id: orderId + status, // Unique ID to prevent duplicates
        title: 'Order status:',
        description: `Order is now ${status}`,
    });
};


const OpenOrders = () => {
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
        orders.sort((a, b) => a.tabId.tableId._id.localeCompare(b.tabId.tableId._id))
    );

    return (
        <View>
            {/* {selectedTable
                ? ( */}
                    <View style={{
                        ...styles.orders,
                    }} >
                    {sortedOrders.map((item, index) => ( <OpenOrder key={item._id} item={item} index={index} />))}
                    </View>
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

const styles = StyleSheet.create({
    orders: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 5
    },
});

export default OpenOrders;