import { HStack, View, Text, Divider } from "native-base";
import React, { Suspense, useEffect } from "react";

import { globalState } from "../../state";

const Table = React.lazy(() => import("./components/Table"));

function Tables() {
  const state = globalState();
  const { tables } = state;

  // useEffect(() => {
  //   if (state.openOrdersPerTable) {
  //     console.log(state.openOrdersPerTable);
  //   }
  // }, [state.openOrdersPerTable]);

  return (
    <View>
      <Text color="text.light" fontSize="xl" fontWeight="bold" mb={3}>
        Active Tables
      </Text>
      <HStack flexWrap="wrap" width="100%">
        {tables.map(
          (table) =>
            table.currentTab && (
              <Suspense key={table._id} fallback={<div>Loading...</div>}>
                <Table
                  mb={3}
                  key={table._id}
                  table={table}
                  style={{
                    flexBasis: `${100 / Math.min(tables.length, 5)}%`,
                  }}
                />
              </Suspense>
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
              <Suspense key={table._id} fallback={<div>Loading...</div>}>
                <Table
                  mb={3}
                  key={table._id}
                  table={table}
                  style={{
                    flexBasis: `${100 / Math.min(tables.length, 5)}%`,
                  }}
                />
              </Suspense>
            )
        )}
      </HStack>
    </View>
  );
}

export default Tables;
