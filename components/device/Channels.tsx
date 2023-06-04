import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  ScrollArea,
  Text,
} from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Refresh } from "tabler-icons-react";
import { Pin } from "../common";
import {
  ChannelChangeHandler,
  DeviceState,
  DeviceStateHandler,
  useCRUD,
  usePrompt,
  useSocket,
} from "../context";
import ChannelRow from "./ChannelRow";

const Channels: FC = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [channelsStatus, setChannelsStatus] = useState<
    DeviceState["channelsStatus"]
  >([]);

  const sContext = useSocket();
  const prompt = usePrompt();
  const crud = useCRUD();
  const { t } = useTranslation();

  useEffect(() => {
    if (!sContext?.socket) {
      const interval = setInterval(() => {
        sContext?.fallback
          .getState()
          .then((r) => setChannelsStatus(r.data.channelsStatus));
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }

    const handleState: DeviceStateHandler = ({ channelsStatus }) => {
      channelsStatus && setChannelsStatus(channelsStatus);
    };
    const handleChannelChange: ChannelChangeHandler = (change) =>
      setChannelsStatus((old) => ({ ...old, ...change }));
    sContext?.socket?.on("state", handleState);
    sContext?.socket?.on("channelChange", handleChannelChange);

    sContext?.socket?.emit("state");
    return () => {
      sContext?.socket?.removeListener("state", handleState);
      sContext?.socket?.removeListener("channelChange", handleChannelChange);
    };
  }, [sContext?.socket]);

  useEffect(() => {
    crud?.pinsCRUD?.list().then((d) => setPins(d.data));
  }, [crud]);

  return (
    <Card h="26rem" shadow="sm" p={"0"} radius={"md"}>
      <Flex justify={"space-between"} align={"center"} h="3rem" px="sm">
        <Text weight={500} size="lg">
          {t("pins")}
        </Text>
        <Flex align={"center"} gap={"sm"}>
          <Button
            onClick={() =>
              prompt?.confirm(
                (confirmed) =>
                  confirmed &&
                  sContext?.fallback
                    .resetDevice()
                    .then((r) => setChannelsStatus(r.data.channelsStatus))
              )
            }
            variant="subtle"
          >
            {t("rest_pins")}
          </Button>
          <ActionIcon
            size={24}
            onClick={() => crud?.pinsCRUD?.list().then((d) => setPins(d.data))}
          >
            <Refresh size={24} />
          </ActionIcon>
          <ActionIcon
            size={24}
            onClick={() =>
              prompt?.newPin(
                () => crud?.pinsCRUD?.list().then((d) => setPins(d.data)),
                pins.reduce((acc, pin) => ({ ...acc, [pin.channel]: true }), {})
              )
            }
          >
            <Plus size={24} />
          </ActionIcon>
        </Flex>
      </Flex>
      <Divider />
      {pins.length ? (
        <>
          <ScrollArea h="20rem" p="0">
            {pins.map((pin, i) => (
              <ChannelRow
                key={pin.channel}
                isRunning={channelsStatus[pin.channel]}
                onChange={(pin) =>
                  setPins((pins) => {
                    pins[i] = pin;
                    return [...pins];
                  })
                }
                pin={pin}
                remove={(id) =>
                  crud?.pinsCRUD
                    ?.remove(id)
                    .then(() =>
                      setPins((pins) =>
                        pins.filter(({ channel }) => id !== channel)
                      )
                    )
                    .catch(() => {
                      // TODO
                    })
                }
              />
            ))}
          </ScrollArea>
          <Divider />
          <Flex h={"3rem"} align={"center"} justify={"stretch"}>
            <Grid
              p="sm"
              w="100%"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              style={{}}
            >
              <Grid.Col span={4}>
                <Text
                  style={{
                    textAlign: "start",
                  }}
                  size="sm"
                >
                  {t("label")}
                </Text>
              </Grid.Col>
              <Grid.Col span={2}>
                <Text size="sm">{t("channel")}</Text>
              </Grid.Col>
              <Grid.Col span={2}>
                <Text size="sm">{t("on_state")}</Text>
              </Grid.Col>
              <Grid.Col span={2}>
                <Text size="sm">{t("status")}</Text>
              </Grid.Col>
              <Grid.Col span={2}>
                <Text size="sm">{t("actions")}</Text>
              </Grid.Col>
            </Grid>
          </Flex>
        </>
      ) : (
        <Flex
          h="23rem"
          direction={"column"}
          align={"center"}
          justify={"center"}
        >
          <Text>{t("no_pins_defined")}</Text>
          <Button
            onClick={() =>
              prompt?.newPin(
                () => crud?.pinsCRUD?.list().then((d) => setPins(d.data)),
                pins.reduce((acc, pin) => ({ ...acc, [pin.channel]: true }), {})
              )
            }
            variant="subtle"
          >
            {t("add_new_pin")}
          </Button>
        </Flex>
      )}
    </Card>
  );
};

export default Channels;
