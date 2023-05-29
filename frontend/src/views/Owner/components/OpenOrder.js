import { Pressable, View, Text, Button, Divider } from "native-base";
import { toastEmitter } from "../../../components/Toast";

import { globalState } from '../../../state';

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


const OpenOrder = ({ item, index }) => {

    const state = globalState();

    console.log(item);
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
            <View >
                {/* style={{ marginTop: !state.selectedTable ? index * 10 : 0 }}> */}
                <View>
                    <Text color="text.light" >
                        Table #{item.tabId.tableId.tableNo}
                    </Text>
                    <Divider />
                    <Text color="text.light" > {item.status} </Text>
                    <Text color="text.light" > {item.lastUpdated.substring(11, 16)} </Text>
                </View>

                <View>
                    {items.map(({ name, quantity }) => (
                        <Text color="text.light" key={name} >
                            {quantity}x {name}
                        </Text>
                    ))}
                </View>

                <View>
                    <View>
                        <Text color="text.light" >Total:</Text>
                        <Text color="text.light" >{item.totalAmount}</Text>
                    </View>

                    <Button
                        // isDisabled={item.status !== "recieved"}
                        variant="subtle"
                        // colorScheme={"green"}
                        // style={[styles.button, item.status !== "recieved" && styles.buttonDisabled]}
                        onPress={async () => {
                            // changeStatusHandler(item._id, "inProgress");
                        }}
                    >
                        Prepare order 🍽
                    </Button>
                    <Button
                        // isDisabled={item.status !== "inProgress"}
                        variant="subtle"
                        // colorScheme={"blue"}
                        // style={[styles.button, item.status !== "inProgress" && styles.buttonDisabled]}
                        onPress={async () => {
                            // changeStatusHandler(item._id, "done");
                        }}
                    >
                        Take order to table 🚚
                    </Button>
                    <Button
                        // style={styles.button}
                        backgroundColor={"#222222"}
                        onPress={async () => {
                            // changeStatusHandler(item._id, "canceled");
                        }}
                    >
                        Cancel order ❌
                    </Button>
                </View>
            </View>
        </Pressable>
    );
}

export default OpenOrder;

<Alert maxWidth="100%" flexDirection="row" bg="brand.700" variant="active" mr={5}>
    <VStack space={1} flexShrink={1} w="100%">
        {/* Card header */}
        <Text color="text.light" fontSize="md" fontWeight="medium" flexShrink={1}>
            Table #{item.tabId.tableId.tableNo}
        </Text>
        <Text color="text.light" fontSize="xs">
            {item.status}
        </Text>
        <Text color="text.light" fontSize="xs">
            {item.lastUpdated.substring(11, 16)}
        </Text>

        {/* Card body */}
        <View>
            {items.map(({ name, quantity }) => (
                <Text color="text.light" key={name} >
                    {quantity}x {name}
                </Text>
            ))}
        </View>

        <View>
            <Text color="text.light" >Total:</Text>
            <Text color="text.light" >{item.totalAmount}</Text>
        </View>

        <Divider bg="transparent" thickness="6" />
        {/* Card buttons */}
        <Button width="100%" size="md" variant="outline" alignSelf="center" onPress={() => { }}>
            Prepare order 🍽
        </Button>
        <Button width="100%" size="md" variant="outline" alignSelf="center" onPress={() => { }}>
            Take order to table 🚚
        </Button>
        <Button width="100%" size="md" variant="outline" alignSelf="center"
            onPress={async () => {
                // changeStatusHandler(item._id, "canceled");
            }}>
            Cancel order ❌
        </Button>
    </VStack>
</Alert>