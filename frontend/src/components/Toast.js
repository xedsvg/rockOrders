import { EventEmitter } from "events";
import { useToast, Alert, VStack, Button, Divider, Text } from "native-base";
import React, { useEffect, useRef } from "react";

// Create a new event emitter
export const toastEmitter = new EventEmitter();

export function ToastManager() {
  const toast = useToast();
  const toastIdRef = useRef();

  useEffect(() => {
    // Listen for 'showToast' events
    toastEmitter.on("showToast", (data) => {
      // Show the toast
      if (!toast.isActive(data.id)) {
        toast.show({
          // status: 'info', // Default status
          // variant: 'subtle', // Default variant
          duration: 3000, // Default duration
          position: "top", // Default position
          isClosable: true,
          ...data,
        });
      }
    });

    toastEmitter.on("showToastWithDismiss", (data) => {
      const { title, description, id, dismissCallback = null } = data;
      // Show the toast
      if (!toast.isActive(id)) {
        toastIdRef.current = toast.show({
          duration: 60 * 60 * 1000, // Default duration
          placement: "top-right",
          render: () => (
            <Alert
              maxWidth="100%"
              alignSelf="center"
              flexDirection="row"
              status="success"
              variant="left-accent"
              mr={5}
            >
              <VStack space={1} flexShrink={1} w="100%" alignItems="center">
                ✋
                <Text
                  color="text.light"
                  fontSize="md"
                  fontWeight="medium"
                  flexShrink={1}
                >
                  {title}
                </Text>
                <Text color="text.light" px="6">
                  {description}
                </Text>
                <Divider bg="transparent" thickness="2" mx="2" />
                {dismissCallback ? (
                  <Button
                    variant="subtle"
                    colorScheme="success"
                    onPress={async () => {
                      dismissCallback();
                      toast.close(toastIdRef.current);
                      toastIdRef.current = null;
                    }}
                  >
                    {" "}
                    On my way!
                  </Button>
                ) : null}
              </VStack>
            </Alert>
          ),
        });
      }
    });

    // Cleanup after component unmounts
    return () => {
      toastEmitter.removeAllListeners("showToast");
      toastEmitter.removeAllListeners("showToastWithDismiss");
    };
  }, []);

  // Render nothing, this is just a manager
  return null;
}
