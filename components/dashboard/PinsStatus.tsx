import {
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  ScrollArea,
  Tabs,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pin, Sequence } from "../common";
import {
  DeviceState,
  DeviceStateHandler,
  ChannelChangeHandler,
  useSocket,
  useCRUD,
} from "../context";
import { Circle } from "tabler-icons-react";
import { openContextModal } from "@mantine/modals";
import { useMediaQuery } from "@mantine/hooks";

const PinsStatus: FC<{ sequences: Sequence[] }> = ({ sequences }) => {
  const sContext = useSocket();
  const crud = useCRUD();

  const { t } = useTranslation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [pins, setPins] = useState<Pin[]>([]);
  const [deviceState, setDeviceState] = useState<DeviceState>({
    channelsStatus: {},
    reservedPins: [],
    runningSequences: [],
  });

  useEffect(() => {
    crud?.pinsCRUD?.list().then((d) => setPins(d.data));

    // Socket is not connected, Manually getting device state
    if (!sContext?.socket) {
      const interval = setInterval(() => {
        sContext?.fallback
          .getState()
          .then((r) => setDeviceState(r.data))
          .catch((err) => {
            console.log(err);
          });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }

    const handleState: DeviceStateHandler = (newState) => {
      setDeviceState((oldState) => ({ ...oldState, ...newState }));
    };

    const handleChannelChange: ChannelChangeHandler = (change) =>
      setDeviceState((old) => ({
        ...old,
        channelsStatus: { ...old.channelsStatus, ...change },
      }));

    sContext?.socket?.on("state", handleState);
    sContext?.socket?.on("channelChange", handleChannelChange);

    sContext?.socket?.emit("state");
    return () => {
      sContext?.socket?.removeListener("state", handleState);
      sContext?.socket?.removeListener("channelChange", handleChannelChange);
    };
  }, [sContext?.socket, crud]);

  return (
    <Card shadow="sm" p="0" radius={"md"} h="18rem">
      <Tabs variant="default" defaultValue={"allPins"}>
        <Tabs.List p="sm" pb="0">
          <Tabs.Tab value="allPins">{t("all_pins")}</Tabs.Tab>
          <Tabs.Tab value="reservedPins">{t("reserved_pins")}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="allPins">
          {pins.length ? (
            <>
              <ScrollArea h="12rem">
                {pins.map((pin) => (
                  <div key={pin.channel}>
                    <Flex
                      align={"center"}
                      justify={"space-between"}
                      px="sm"
                      h="2.5rem"
                    >
                      <Text size="sm">{pin.label}</Text>
                      <ThemeIcon
                        radius={"lg"}
                        size={12}
                        color={
                          deviceState.channelsStatus[pin.channel]
                            ? "green"
                            : "red"
                        }
                      >
                        <Circle stroke="0" />
                      </ThemeIcon>
                    </Flex>
                    <Divider />
                  </div>
                ))}
              </ScrollArea>
              <Divider />
              <Group position="apart" pt="sm" p={"xs"}>
                <Text weight={"bold"}>{t("pin")}</Text>
                <Text weight={"bold"}>{t("status")}</Text>
              </Group>
            </>
          ) : (
            <Center h={"14rem"}>
              <Flex direction={"column"} align={"center"} justify={"center"}>
                <Text>{t("no_pins_defined")}</Text>
                <Button
                  onClick={() => {
                    openContextModal({
                      modal: "PinModal",
                      title: t("add_new_pin"),
                      fullScreen: isMobile,
                      innerProps: {
                        onChange: () =>
                          crud?.pinsCRUD?.list().then((d) => setPins(d.data)),
                        usedPins: {},
                      },
                    });
                  }}
                  variant="subtle"
                >
                  {t("add_new_pin")}
                </Button>
              </Flex>
            </Center>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="reservedPins">
          {deviceState.reservedPins?.length ? (
            <>
              <ScrollArea h="12rem">
                {deviceState.reservedPins.map((reserved) => (
                  <div key={reserved.pin.channel}>
                    <Flex
                      align={"center"}
                      justify={"space-between"}
                      px="sm"
                      h="2.5rem"
                    >
                      <Text size="sm">{reserved.pin.label}</Text>
                      <Text size="sm">
                        {sequences.find((seq) => reserved.sequenceId === seq.id)
                          ?.name || "NULL"}
                      </Text>
                    </Flex>
                    <Divider />
                  </div>
                ))}
              </ScrollArea>
              <Divider />
              <Group position="apart" pt="sm" p={"xs"}>
                <Text weight={"bold"}>{t("pin")}</Text>
                <Text weight={"bold"}>{t("sequence")}</Text>
              </Group>
            </>
          ) : (
            <Center h={"14rem"}>
              <Flex direction={"column"} align={"center"} justify={"center"}>
                <Text>{t("no_reserved_pins")}</Text>
              </Flex>
            </Center>
          )}
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};

export default PinsStatus;
