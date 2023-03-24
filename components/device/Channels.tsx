import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  ScrollArea,
  Table,
  Text,
  useMantineTheme,
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
  const theme = useMantineTheme();

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
    <Container
      my="0"
      px="sm"
      py="0"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <Group py="xs" position="apart">
        <Text size="xl">{t("pins")}</Text>
        <Group>
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
        </Group>
      </Group>
      <Divider />
      {pins.length ? (
        <ScrollArea pt="xs" m="0" p="0">
          <Table
            striped
            highlightOnHover
            style={{
              textAlign: "center",
              verticalAlign: "middle",
            }}
          >
            <tbody>
              {pins.map((p, i) => (
                <ChannelRow
                  key={p.channel}
                  onChange={(pin) =>
                    setPins((pins) => {
                      pins[i] = pin;
                      return [...pins];
                    })
                  }
                  pin={p}
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
                  isRunning={channelsStatus && channelsStatus[p.channel]}
                />
              ))}
            </tbody>
            <tfoot
              style={{
                position: "sticky",
                bottom: 0,
                background:
                  theme.colorScheme === "dark" ? theme.colors.dark[4] : "white",
              }}
            >
              <tr>
                <th style={{ textAlign: "start" }}>{t("label")}</th>
                <th style={{ textAlign: "start" }}>{t("channel")}</th>
                <th style={{ textAlign: "start" }}>{t("on_state")}</th>
                <th style={{ textAlign: "start" }}>{t("status")}</th>
                <th style={{ textAlign: "start" }}>{t("actions")}</th>
              </tr>
            </tfoot>
          </Table>
        </ScrollArea>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
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
        </div>
      )}
    </Container>
  );
};

export default Channels;
