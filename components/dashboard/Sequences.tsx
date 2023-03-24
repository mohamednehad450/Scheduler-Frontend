import { Card, Group, Tabs, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Sequence } from "../common";
import { DeviceState, DeviceStateHandler, useSocket } from "../context";
import ScrollList from "./ScrollList";

const Sequences: FC<{ sequences: Sequence[] }> = ({ sequences }) => {
  const sContext = useSocket();
  const router = useRouter();

  const { t } = useTranslation();

  const [runningSequences, setRunningSequences] = useState<
    DeviceState["runningSequences"]
  >([]);

  const running =
    sequences.filter((s) =>
      (runningSequences || []).some((id) => id === s.id)
    ) || [];
  const active = sequences.filter((s) => s.active);

  useEffect(() => {
    const handleState: DeviceStateHandler = ({ runningSequences }) => {
      runningSequences && setRunningSequences(runningSequences);
    };

    if (!sContext?.socket) {
      const interval = setInterval(() => {
        sContext?.fallback
          .getState()
          .then((r) => setRunningSequences(r.data.runningSequences));
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }

    sContext?.socket?.on("state", handleState);
    sContext?.socket?.emit("state");
    return () => {
      sContext?.socket?.removeListener("state", handleState);
    };
  }, [sContext]);

  return (
    <Card shadow="sm" p="sm" radius={"md"} style={{ height: "18rem" }}>
      <Tabs variant="default">
        <Tabs.Tab label={t("active_sequences")}>
          <ScrollList
            body={
              active.length &&
              active.map((s) => (
                <Group
                  key={s.id}
                  p={"xs"}
                  position="apart"
                  sx={(theme) => ({
                    borderBottom: `2px solid ${
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[4]
                        : theme.colors.dark[0]
                    }`,
                    ":hover": {
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[5]
                          : theme.colors.gray[1],
                      cursor: "pointer",
                    },
                  })}
                  onClick={() => router.push("sequences/" + s.id)}
                >
                  <Text size="sm">{s.name}</Text>
                  <Text size="sm">
                    {s.crons.length} {t("triggers")}
                  </Text>
                </Group>
              ))
            }
            empty={<Text>{t("no_active_sequences")}</Text>}
            footer={
              <Group position="apart" p={"xs"}>
                <Text weight={"bold"}>{t("sequence")}</Text>
                <Text weight={"bold"}>{t("no_triggers")}</Text>
              </Group>
            }
          />
        </Tabs.Tab>
        <Tabs.Tab label={t("running_sequences")}>
          <ScrollList
            body={
              running.length &&
              running.map((s) => (
                <Group
                  key={s.id}
                  p={"xs"}
                  position="apart"
                  sx={(theme) => ({
                    borderBottom: `2px solid ${
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[4]
                        : theme.colors.dark[0]
                    }`,
                    ":hover": {
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[5]
                          : theme.colors.gray[1],
                      cursor: "pointer",
                    },
                  })}
                  onClick={() => router.push("sequences/" + s.id)}
                >
                  <Text size="sm">{s.name}</Text>
                  <Text size="sm">
                    {s.lastRun ? new Date(s.lastRun).toLocaleString() : "Never"}
                  </Text>
                </Group>
              ))
            }
            empty={<Text>{t("no_running_sequences")}</Text>}
            footer={
              <Group position="apart" p={"xs"}>
                <Text weight={"bold"}>{t("sequence")}</Text>
                <Text weight={"bold"}>{t("ran_at")}</Text>
              </Group>
            }
          />
        </Tabs.Tab>
      </Tabs>
    </Card>
  );
};

export default Sequences;
