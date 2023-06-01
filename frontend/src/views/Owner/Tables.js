import { HStack, View, Text, Divider } from "native-base";
import React from "react";

import Table from "./components/Table";
import { globalState } from "../../state";

function Tables() {
  const state = globalState();
  const { tables } = state;

  return (
    <View>
      <Text color="text.light" fontSize="xl" fontWeight="bold" mb={3}>
        Active Tables
      </Text>
      <HStack flexWrap="wrap" width="100%">
        {tables.map(
          (table) =>
            table.currentTab && (
              <Table
                mb={3}
                key={table._id}
                table={table}
                style={{
                  flexBasis: `${100 / Math.min(tables.length, 5)}%`,
                }}
              />
            )
        )}
      </HStack>

      <Divider bg="transparent" thickness="20" />
      <Text color="text.light" fontSize="xl" fontWeight="bold" mb={3}>
        Open Tables
      </Text>
      <HStack flexWrap="wrap" width="100%">
        {tables.map(
          (table) =>
            !table.currentTab && (
              <Table
                mb={3}
                key={table._id}
                table={table}
                style={{
                  flexBasis: `${100 / Math.min(tables.length, 5)}%`,
                }}
              />
            )
        )}
      </HStack>
    </View>
  );
}

export default Tables;
