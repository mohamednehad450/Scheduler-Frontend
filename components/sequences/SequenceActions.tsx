import { Button, Card, Divider, Grid, Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CalendarEvent,
  CalendarOff,
  Edit,
  Link,
  PlayerPause,
  PlayerPlay,
  Trash,
} from "tabler-icons-react";
import { LoadingButton, Sequence } from "../common";
import {
  DeviceState,
  DeviceStateHandler,
  usePrompt,
  useSocket,
} from "../context";
import { useCRUD } from "../context";

interface SequenceActionsProps {
  sequence: Sequence;
  onChange: (s: Sequence) => void;
}

const SequenceActions: FC<SequenceActionsProps> = ({ sequence, onChange }) => {
  const prompt = usePrompt();
  const sContext = useSocket();

  const crud = useCRUD();

  const [runningSequences, setRunningSequences] = useState<
    DeviceState["runningSequences"]
  >([]);

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

  const isRunning = runningSequences.some((id) => id === sequence.id);
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Card shadow="lg" p="0" radius={"md"} h="18rem">
      <Text weight={500} size="lg" p="xs" pb="0">
        {t("actions")}
      </Text>
      <Divider />
      <Grid p="md">
        <Grid.Col span={6}>
          <LoadingButton
            w="100%"
            onClick={(onDone) => {
              if (isRunning) {
                sContext?.fallback
                  .stop(sequence.id)
                  .then((r) => {
                    setRunningSequences(r.data.runningSequences);
                  })
                  .catch(console.error)
                  .finally(() => onDone());
                return;
              }
              sContext?.fallback
                .run(sequence.id)
                .then((r) => {
                  setRunningSequences(r.data.state.runningSequences);
                  onChange(r.data.sequence);
                })
                .catch(console.error)
                .finally(() => onDone());
            }}
          >
            <Group>
              {isRunning ? <PlayerPause size={16} /> : <PlayerPlay size={16} />}
              {isRunning ? t("stop") : t("run")}
            </Group>
          </LoadingButton>
        </Grid.Col>
        <Grid.Col span={6}>
          <LoadingButton
            p={0}
            w="100%"
            onClick={(onDone) => {
              crud?.sequenceCRUD
                ?.update(sequence?.id, { active: !sequence.active })
                .then((d) => {
                  onDone();
                  onChange(d.data);
                })
                .catch((err) => {
                  // TODO
                  onDone();
                });
            }}
          >
            <Group>
              {sequence.active ? (
                <CalendarOff size={16} />
              ) : (
                <CalendarEvent size={16} />
              )}
              {sequence.active ? t("deactivate") : t("activate")}
            </Group>
          </LoadingButton>
        </Grid.Col>
        <Grid.Col span={12}>
          <Button
            p={0}
            w="100%"
            variant="outline"
            onClick={() =>
              prompt?.linkSequence(
                (s) => s && onChange(s),
                sequence.id,
                sequence.crons.map((c) => c.id)
              )
            }
          >
            <Group>
              <Link size={16} />
              {t("edit_triggers")}
            </Group>
          </Button>
        </Grid.Col>
        <Grid.Col span={12}>
          <Button
            p={0}
            w="100%"
            variant={"outline"}
            onClick={() =>
              prompt?.newSequence((s) => s && onChange(s), sequence)
            }
          >
            <Group>
              <Edit size={16} />
              {t("edit_sequence")}
            </Group>
          </Button>
        </Grid.Col>
        <Grid.Col>
          <Button
            p={0}
            w="100%"
            color={"red"}
            onClick={() => {
              prompt?.confirm((confirmed) => {
                if (!confirmed) {
                  return;
                }
                crud?.sequenceCRUD
                  ?.remove(sequence?.id)
                  .then(() => router.back())
                  .catch((err) => {
                    // TODO
                  });
              });
            }}
          >
            <Group>
              <Trash size={16} />
              {t("delete")}
            </Group>
          </Button>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default SequenceActions;
