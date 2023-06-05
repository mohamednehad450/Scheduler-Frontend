import { Button, Flex, Table, Text, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import type { Sequence } from "../common";
import { DeviceState, DeviceStateHandler, useSocket } from "../context";
import SequenceRow from "./SequenceRow";
import { useRouter } from "next/router";
import { useCRUD } from "../context";
import { useTranslation } from "react-i18next";
import { openContextModal } from "@mantine/modals";
import { useMediaQuery } from "@mantine/hooks";

interface SequenceListProps {
  sequences: Sequence[];
  onChange: (sequences: Sequence[]) => void;
  show: "running" | "active" | "all";
}

const SequenceList: FC<SequenceListProps> = ({ sequences, onChange, show }) => {
  const sContext = useSocket();
  const [runningSequences, setRunningSequences] = useState<
    DeviceState["runningSequences"]
  >([]);

  const crud = useCRUD();

  const router = useRouter();
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  useEffect(() => {
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

    const handleState: DeviceStateHandler = ({ runningSequences }) => {
      runningSequences && setRunningSequences(runningSequences);
    };
    sContext?.socket?.on("state", handleState);
    sContext?.socket?.emit("state");
    return () => {
      sContext?.socket?.removeListener("state", handleState);
    };
  }, [sContext?.socket]);

  const list = sequences
    .map((s, i) => ({ ...s, i }))
    ?.filter((s) => {
      switch (show) {
        case "all":
          return true;
        case "active":
          return s.active;
        case "running":
          return runningSequences.some((id) => id === s.id);
      }
    });

  return (
    <>
      {list.length ? (
        <Table
          striped
          highlightOnHover
          verticalSpacing={"xs"}
          horizontalSpacing="sm"
          sx={() => ({ ":hover": { cursor: "pointer" } })}
        >
          <thead style={{ position: "sticky" }}>
            <tr>
              <th style={{ textAlign: "start" }}>{t("name")}</th>
              <th style={{ textAlign: "start" }}>{t("last_run")}</th>
              <th style={{ textAlign: "start" }}>{t("no_triggers")}</th>
              <th style={{ textAlign: "start" }}>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <SequenceRow
                key={String(s.id)}
                isRunning={runningSequences.some((id) => id === s.id)}
                sequence={s}
                remove={(id) =>
                  crud?.sequenceCRUD
                    ?.remove(id)
                    .then(() => {
                      onChange(sequences.filter((seq) => id !== seq.id));
                    })
                    .catch((err) => {
                      // TODO
                    })
                }
                onChange={(newSeq) => {
                  const newSequences = [...sequences];
                  newSequences[s.i] = newSeq;
                  onChange(newSequences);
                }}
                run={(id, onDone) => {
                  sContext?.fallback
                    .run(id)
                    .then((r) => {
                      const newSequences = [...sequences];
                      newSequences[s.i] = r.data.sequence;
                      onChange(newSequences);
                      setRunningSequences(r.data.state.runningSequences);
                    })
                    .catch(console.error)
                    .finally(() => onDone && onDone());
                }}
                stop={(id, onDone) => {
                  sContext?.fallback
                    .stop(id)
                    .then((r) => setRunningSequences(r.data.runningSequences))
                    .catch(console.error)
                    .finally(() => onDone && onDone());
                }}
              />
            ))}
          </tbody>
        </Table>
      ) : (
        <Flex w="100%" h="10rem" align={"center"} justify={"center"}>
          {show === "all" || !sequences.length ? (
            <Flex direction={"column"}>
              <Text>{t("no_sequences_defined")}</Text>
              <Button
                variant="subtle"
                onClick={() =>
                  openContextModal({
                    title: t("add_new_sequences"),
                    modal: "SequenceModal",
                    size: "xl",
                    fullScreen: isMobile,
                    innerProps: {
                      onChange: (newSeq) =>
                        router.push("/sequences/" + newSeq.id),
                    },
                  })
                }
              >
                {t("add_new_sequences")}
              </Button>
            </Flex>
          ) : (
            <Text>
              {show === "active"
                ? t("no_active_sequences")
                : t("no_running_sequences")}
            </Text>
          )}
        </Flex>
      )}
    </>
  );
};
export default SequenceList;
