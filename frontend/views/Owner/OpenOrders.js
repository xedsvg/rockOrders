import React, { useEffect, useState } from "react";

import { globalState } from '../../state';

import { StyleSheet, Text, View, Animated } from "react-native";
import { Button } from "native-base";
import { baseUrl } from '../../settings';

const changeStatusHandler = async (orderId, status) => {
  const data = await fetch(`${baseUrl}/owner/orders/update/${orderId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: status })
  });
  alert("Order status changed to " + status + ' ' + data.status);
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
    const { openOrders } = state;
    
    //Animations for flashing orders should not be moved to global state but maybe use hookState for consistency? meh
    const [opacityValue] = useState(new Animated.Value(1));
    const [flashingOrders, setFlashingOrders] = useState([]);
    const [flashing, setFlashing] = useState(false);
        
    useEffect(() => {
        const intervalId = setInterval(() => {
            const flashingOrders = [];
            const now = new Date();

            openOrders.forEach((order) => {
                const lastUpdated = new Date(order.lastUpdated);
                const diffMs = now - lastUpdated;
                const diffMin = diffMs / 1000 / 60;
                if (diffMin >= 5) {
                    flashingOrders.push(order._id);
                }
            });

            setFlashingOrders(flashingOrders);
            if (flashingOrders.length > 0 && flashing) {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(opacityValue, {
                            toValue: 0.5,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacityValue, {
                            toValue: 1,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            } else {
                opacityValue.setValue(1);
            }

        }, 5000);

        return () => clearInterval(intervalId);
    }, [openOrders, opacityValue, flashing]);

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

    const flashColor = opacityValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255, 0, 0, 1)', 'rgba(255, 255, 255, 1)']
    });

    return (
        <View>
            {!sortedOrders.length && <Text style={styles.title}>
                No orders
            </Text>}

            <Button style={styles.button} onPress={() => {
                setFlashing(!flashing);
            }}>
                {flashing ? "Disable Flashing" : "Enable Flashing"}
            </Button>

            {sortedOrders.length > 0 &&
                <View style={styles.orders}>
                    {sortedOrders.map((item) => {
                        const items = getItemsWithQuantities(item.items);
                        const isFlashing = flashingOrders.includes(item._id);

                        return (
                            <Animated.View
                                style={[
                                    styles.container,
                                    { backgroundColor: isFlashing ? flashColor : "white" }
                                ]}
                                key={item._id}
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

                            </Animated.View>
                        );
                    })}
                </View>
            }
        </View>
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