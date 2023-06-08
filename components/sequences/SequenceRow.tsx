import {
  Group,
  Text,
  ActionIcon,
  Tooltip,
  MediaQuery,
  Menu,
  useMantineTheme,
  ScrollArea,
} from "@mantine/core";
import { FC, MouseEventHandler } from "react";
import {
  Calendar,
  CalendarOff,
  Copy,
  Dots,
  Edit,
  PlayerPause,
  PlayerPlay,
  Trash,
} from "tabler-icons-react";
import type { Sequence } from "../common";
import { useRouter } from "next/router";
import { useCRUD } from "../context";
import { useTranslation } from "react-i18next";
import { openConfirmModal, openContextModal } from "@mantine/modals";
import { useMediaQuery } from "@mantine/hooks";

const stopPropagation: (cb?: MouseEventHandler) => MouseEventHandler =
  (cb) => (e) => {
    e.stopPropagation();
    cb && cb(e);
  };

interface SequenceRowProps {
  sequence: Sequence;
  isRunning: boolean;
  run: (id: Sequence["id"], onDone?: () => void) => void;
  stop: (id: Sequence["id"], onDone?: () => void) => void;
  remove: (id: Sequence["id"]) => void;
  onChange: (seq: Sequence) => void;
}

const SequenceRow: FC<SequenceRowProps> = ({
  sequence,
  isRunning,
  run,
  stop,
  remove,
  onChange,
}) => {
  const router = useRouter();
  const crud = useCRUD();
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const updateSequence = () =>
    crud?.sequenceCRUD
      ?.get(sequence.id)
      .then((d) => d.data && onChange(d.data))
      .catch((err) => {
        // TODO
      });
  const toggleRun = () =>
    isRunning
      ? stop(sequence.id, updateSequence)
      : run(sequence.id, updateSequence);
  const toggleActive = () =>
    crud?.sequenceCRUD
      ?.update(sequence.id, { active: !sequence.active })
      .then((d) => d.data && onChange(d.data))
      .catch((err) => {
        // TODO
      });
  const edit = () =>
    openContextModal({
      modal: "SequenceModal",
      title: sequence.name,
      fullScreen: isMobile,
      scrollAreaComponent: ScrollArea.Autosize,
      size: "xl",
      innerProps: {
        onChange,
        initialSequence: sequence,
      },
    });

  const copy = () =>
    openContextModal({
      modal: "SequenceModal",
      title: t("add_new_sequence"),
      fullScreen: isMobile,
      scrollAreaComponent: ScrollArea.Autosize,
      size: "xl",
      innerProps: {
        onChange: (seq) => seq && router.push(router.route + "/" + seq.id),
        initialSequence: { orders: sequence.orders },
      },
    });

  const removeFunc = () =>
    openConfirmModal({
      title: t("are_you_sure"),
      centered: true,
      labels: { cancel: t("cancel"), confirm: t("confirm") },
      onConfirm: () => remove(sequence.id),
    });
  return (
    <tr onClick={() => router.push(router.route + "/" + sequence.id)}>
      <td>
        <Text weight={"bold"}>{sequence.name}</Text>
      </td>
      <td>
        <Text>
          {sequence.lastRun
            ? new Date(sequence.lastRun).toLocaleString()
            : t("never_run")}
        </Text>
      </td>
      <td>
        <Text>
          {sequence.crons.length
            ? sequence.crons.length + " " + t("triggers")
            : t("zero_triggers")}{" "}
        </Text>
      </td>
      <td onClick={stopPropagation()}>
        <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
          <Group>
            <Tooltip label={isRunning ? t("stop") : t("run")} withArrow>
              <ActionIcon variant="default" onClick={toggleRun}>
                {isRunning ? (
                  <PlayerPause size={16} />
                ) : (
                  <PlayerPlay size={16} />
                )}
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={sequence.active ? t("deactivate") : t("activate")}
              withArrow
            >
              <ActionIcon variant="default" onClick={toggleActive}>
                {sequence.active ? (
                  <CalendarOff size={16} />
                ) : (
                  <Calendar size={16} />
                )}
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t("edit")} withArrow>
              <ActionIcon variant="default" onClick={edit}>
                <Edit size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t("copy")} withArrow>
              <ActionIcon variant="default" onClick={copy}>
                <Copy size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t("delete")} withArrow>
              <ActionIcon variant="default" color={"red"} onClick={removeFunc}>
                <Trash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </MediaQuery>
        <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
          <Menu>
            <Menu.Target>
              <ActionIcon>
                <Dots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{t("actions")}</Menu.Label>
              <Menu.Item
                onClick={toggleRun}
                icon={
                  isRunning ? (
                    <PlayerPause size={16} />
                  ) : (
                    <PlayerPlay size={16} />
                  )
                }
              >
                {isRunning ? t("stop") : t("run")}
              </Menu.Item>
              <Menu.Item
                onClick={toggleActive}
                icon={
                  sequence.active ? (
                    <CalendarOff size={16} />
                  ) : (
                    <Calendar size={16} />
                  )
                }
              >
                {sequence.active ? t("deactivate") : t("activate")}
              </Menu.Item>
              <Menu.Item onClick={edit} icon={<Edit size={16} />}>
                {t("edit")}
              </Menu.Item>
              <Menu.Item onClick={copy} icon={<Copy size={16} />}>
                {t("copy")}
              </Menu.Item>
              <Menu.Item
                onClick={removeFunc}
                color={"red"}
                icon={<Trash size={16} />}
              >
                {t("delete")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </MediaQuery>
      </td>
    </tr>
  );
};

export default SequenceRow;
