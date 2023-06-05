import {
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
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
import { DeviceState, DeviceStateHandler, useSocket } from "../context";
import { useCRUD } from "../context";
import { openConfirmModal, openContextModal } from "@mantine/modals";
import { useMediaQuery } from "@mantine/hooks";

interface SequenceActionsProps {
  sequence: Sequence;
  onChange: (s: Sequence) => void;
}

const SequenceActions: FC<SequenceActionsProps> = ({ sequence, onChange }) => {
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

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

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
              openContextModal({
                modal: "LinkSequenceModal",
                title: t("link_schedules"),
                centered: true,
                innerProps: {
                  onChange,
                  sequenceId: sequence.id,
                  initialCrons: sequence.crons.map((c) => c.id),
                },
              })
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
              openContextModal({
                modal: "SequenceModal",
                title: sequence.name,
                fullScreen: isMobile,
                size: "xl",
                innerProps: {
                  onChange,
                  initialSequence: sequence,
                },
              })
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
            onClick={() =>
              openConfirmModal({
                title: t("are_you_sure"),
                centered: true,
                labels: { cancel: t("cancel"), confirm: t("confirm") },
                onConfirm: () =>
                  crud?.sequenceCRUD
                    ?.remove(sequence?.id)
                    .then(() => router.back())
                    .catch((err) => {
                      // TODO
                    }),
              })
            }
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
