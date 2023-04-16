import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button } from "native-base";

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

export default function Order({ orders, changeStatusHandler }) {
    const groupedOrders = {};
    orders.forEach((order) => {
        const tableId = order.tabId.tableId;
        if (groupedOrders[tableId]) {
            groupedOrders[tableId].push(order);
        } else {
            groupedOrders[tableId] = [order];
        }
    });

    const sortedOrders = Object.values(groupedOrders).flatMap((orders) =>
        orders.sort((a, b) => a.tabId.tableId.localeCompare(b.tabId.tableId))
    );

    return (
        <View>
            {!sortedOrders.length && <Text style={styles.title}>
                "No orders"
            </Text>}
            {sortedOrders.length &&
                <View style={styles.orders}>
                    {sortedOrders.map((item) => {
                        const items = getItemsWithQuantities(item.items);

                        return (
                            <View style={styles.container} key={item._id}>
                                <View>
                                <Text style={styles.tableNo}>
                                    Table Nr: 2
                                </Text>
                                <View style={styles.separator} />
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
                                    style={styles.button}
                                    onPress={async () => {
                                        changeStatusHandler(item._id, "inProgress");
                                    }}
                                >
                                    Start Preparing 🍽️
                                </Button>
                                </View>
                            </View>
                        );
                    })}
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
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
        marginTop: 10,
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
        backgroundColor: "#222222",
        padding: 12,
        borderRadius: 6,
    }
});
