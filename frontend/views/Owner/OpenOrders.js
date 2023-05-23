import React from "react";

import { globalState } from '../../state';
import { toastEmitter } from '../../components/Toast';

import { Text, View, Button, ZStack, Pressable, Box } from "native-base";
import { StyleSheet } from "react-native";

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

const getItemsWithQuantities = (items) => {
    const itemsMap = {};

    items.forEach((item) => {
        if (itemsMap[item.name]) {
            itemsMap[item.name]++;
        } else {
            itemsMap[item.name] = 1;
        }
    });

    return Object.entries(itemsMap).map(([name, quantity]) => ({ name, quantity }));
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
            {/* {!sortedOrders.length && <Text style={styles.title}>
                No orders
            </Text>} */}

            {/* {selectedTable && (
                <Button onPress={() => setSelectedTable(null)}>
                    Exit table view
                </Button>
            )} */}
            {selectedTable
                ? (
                    <View style={styles.orders}>
                        {sortedOrders.map((item, index) => renderOrder(item, index, state))}
                    </View>
                ) : (
                    <ZStack style={styles.orders}>
                        {sortedOrders.map((item, index) => renderOrder(item, index, state))}
                    </ZStack>
                )}
        </View>
    );
}

const renderOrder = (item, index, state) => {
    const items = getItemsWithQuantities(item.items);
    
    return (
        <Pressable
            key={item._id}
            onLongPress={() => { 
                state.selectedTable = item.tabId.tableId._id;
                toastEmitter.emit('showToast', {
                    title: 'View mode changed',
                    description: `If you want to exit table view, press the order again.`,
                });
            }}
            onPress={() => {
                state.selectedTable = null;
                toastEmitter.emit('showToast', {
                    title: 'View mode changed',
                    description: `If you want to view all the orders from the table, long press the order.`,
                });
            }}
        >
            <View
                style={[
                    styles.container,
                    { marginTop: !state.selectedTable ? index * 10 : 0 },
                ]}
            >
                <View>
                    <Text style={styles.tableNo}>
                        Table #{item.tabId.tableId.tableNo}
                    </Text>
                    <View style={styles.separator} />
                    <Text style={styles.lastUpdated}> {item.status} </Text>
                    <Text style={styles.lastUpdated}> {item.lastUpdated.substring(11, 16)} </Text>
                </View>

                <View style={styles.items}>
                    {items.map(({ name, quantity }) => (
                        <Text key={name} style={styles.product}>
                            {quantity}x {name}
                        </Text>
                    ))}
                </View>

                <View>
                    <View style={styles.total}>
                        <Text style={styles.label}>Total:</Text>
                        <Text style={styles.totalAmount}>{item.totalAmount}</Text>
                    </View>

                    <Button
                        isDisabled={item.status !== "recieved"}
                        variant="subtle"
                        colorScheme={"green"}
                        style={[styles.button, item.status !== "recieved" && styles.buttonDisabled]}
                        onPress={async () => {
                            changeStatusHandler(item._id, "inProgress");
                        }}
                    >
                        Prepare order 🍽
                    </Button>
                    <Button
                        isDisabled={item.status !== "inProgress"}
                        variant="subtle"
                        colorScheme={"blue"}
                        style={[styles.button, item.status !== "inProgress" && styles.buttonDisabled]}
                        onPress={async () => {
                            changeStatusHandler(item._id, "done");
                        }}
                    >
                        Take order to table 🚚
                    </Button>
                    <Button
                        style={styles.button}
                        backgroundColor={"#222222"}
                        onPress={async () => {
                            changeStatusHandler(item._id, "canceled");
                        }}
                    >
                        Cancel order ❌
                    </Button>
                </View>

            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    lastUpdated: {
        marginTop: 5,
        fontSize: 14,
        textAlign: "center",
    },
    orders: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 5
    },
    title: {
        alignSelf: "center",
        marginBottom: 40,
        fontSize: 16,
        color: "black",
        justifySelf: "flex-start",
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "black",

        display: 'flex',
        justifyContent: 'space-between',
    },
    tableNo: {
        marginLeft: 0,
        fontSize: 22,
        marginTop: 10,
        color: "black",
        textAlign: "center",
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: "black",
        marginHorizontal: 90,
        marginTop: 5,
        justifySelf: "flex-start",
    },
    items: {
        borderRadius: 10,
        marginTop: 20,
        marginHorizontal: 10,
        padding: 10
    },
    product: {
        fontSize: 14
    },
    total: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        marginTop: 20,
        marginHorizontal: 10,
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 16,
        color: "black",
    },
    totalAmount: {
        fontSize: 16,
        color: "green",
        marginLeft: 10,
    },
    button: {
        paddingTop: 10,
        marginTop: 10,
        marginBottom: 20,
        margin: 10,
        padding: 12,
        borderRadius: 6,
    },
});

export default OpenOrders;