import {
  Card,
  Center,
  Divider,
  Flex,
  Group,
  ScrollArea,
  Tabs,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Sequence } from "../common";
import { DeviceState, DeviceStateHandler, useSocket } from "../context";

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
    <Card shadow="sm" p="0" radius={"md"} style={{ height: "18rem" }}>
      <Tabs variant="default" defaultValue={"active"}>
        <Tabs.List p="xs" pb="0">
          <Tabs.Tab value="active">{t("active_sequences")}</Tabs.Tab>
          <Tabs.Tab value="running">{t("running_sequences")}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="active">
          {active.length ? (
            <>
              <ScrollArea h="12rem">
                {active.map((sequence) => (
                  <UnstyledButton
                    key={sequence.id}
                    w="100%"
                    sx={(theme) => ({
                      ":hover": {
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[5]
                            : theme.colors.gray[1],
                      },
                    })}
                    onClick={() => router.push("sequences/" + sequence.id)}
                  >
                    <Flex
                      align={"center"}
                      justify={"space-between"}
                      px="sm"
                      h="2.5rem"
                    >
                      <Text size="sm">{sequence.name}</Text>
                      <Text size="sm">
                        {sequence.crons.length} {t("triggers")}
                      </Text>
                    </Flex>
                    <Divider />
                  </UnstyledButton>
                ))}
              </ScrollArea>
              <Divider />
              <Group position="apart" pt="sm" p={"xs"}>
                <Text weight={"bold"}>{t("sequence")}</Text>
                <Text weight={"bold"}>{t("no_triggers")}</Text>
              </Group>
            </>
          ) : (
            <Center h={"14rem"}>
              <Text>{t("no_active_sequences")}</Text>
            </Center>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="running">
          {running.length ? (
            <>
              <ScrollArea h="12rem">
                {running.map((sequence) => (
                  <UnstyledButton
                    key={sequence.id}
                    w="100%"
                    sx={(theme) => ({
                      ":hover": {
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[5]
                            : theme.colors.gray[1],
                      },
                    })}
                    onClick={() => router.push("sequences/" + sequence.id)}
                  >
                    <Flex
                      align={"center"}
                      justify={"space-between"}
                      px="sm"
                      h="2.5rem"
                    >
                      <Text size="sm">{sequence.name}</Text>
                      <Text size="sm">
                        {sequence.lastRun
                          ? new Date(sequence.lastRun).toLocaleString()
                          : "Never"}
                      </Text>
                    </Flex>
                    <Divider />
                  </UnstyledButton>
                ))}
              </ScrollArea>
              <Divider />
              <Group position="apart" pt="sm" p={"xs"}>
                <Text weight={"bold"}>{t("sequence")}</Text>
                <Text weight={"bold"}>{t("ran_at")}</Text>
              </Group>
            </>
          ) : (
            <Center h={"14rem"}>
              <Text>{t("no_running_sequences")}</Text>
            </Center>
          )}
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};

export default Sequences;
