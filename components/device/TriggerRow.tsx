import {
  Button,
  Divider,
  Flex,
  Group,
  Table,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { FC } from "react";
import { Edit, Link, Trash } from "tabler-icons-react";
import { Cron } from "../common";
import cronstrue from "cronstrue";
import { nextCronDates } from "../common";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { openContextModal } from "@mantine/modals";
import { openConfirmModal } from "@mantine/modals";
import { useMediaQuery } from "@mantine/hooks";

interface CronRowProps {
  cron: Cron;
  onChange: (cron: Cron) => void;
  remove: (id: Cron["id"]) => void;
}

const TriggerRow: FC<CronRowProps> = ({ cron, onChange, remove }) => {
  const router = useRouter();

  const { t, i18n } = useTranslation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <>
      <Flex direction={"column"} py="md">
        <Text
          size="sm"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.gray[6]
                : theme.colors.gray[7],
          })}
        >
          {t("schedule_description")}
        </Text>
        <Text px="md" pt="sm">
          {cronstrue.toString(cron.cron, {
            monthStartIndexZero: true,
            locale: i18n.language,
          })}
        </Text>
      </Flex>
      <Divider />
      <Flex direction={"column"} py="md">
        <Text
          size="sm"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.gray[6]
                : theme.colors.gray[7],
          })}
        >
          {t("actions")}
        </Text>
        <Group px="md" pt="sm">
          <Button
            variant="light"
            onClick={() =>
              openContextModal({
                modal: "CronModal",
                title: cron.label,
                size: "lg",
                fullScreen: isMobile,
                innerProps: {
                  onChange,
                  initCron: cron,
                },
              })
            }
          >
            <Group position="center">
              <Edit size="16" />
              {t("edit")}
            </Group>
          </Button>
          <Button
            variant="light"
            onClick={() =>
              openContextModal({
                modal: "LinkCronModal",
                title: t("link_sequences"),
                centered: true,
                innerProps: {
                  onChange,
                  cronId: cron.id,
                  initialSequences: cron.sequences.map((s) => s.id),
                },
              })
            }
          >
            <Group position="center">
              <Link size="16" />
              {t("link")}
            </Group>
          </Button>
          <Button
            variant="light"
            color={"red"}
            onClick={() =>
              openConfirmModal({
                title: t("are_you_sure"),
                centered: true,
                labels: {
                  cancel: t("cancel"),
                  confirm: t("confirm"),
                },
                onConfirm: () => remove(cron.id),
              })
            }
          >
            <Group position="center">
              <Trash size="16" />
              {t("delete")}
            </Group>
          </Button>
        </Group>
      </Flex>
      <Divider />
      <Flex direction={"column"} py="md">
        <Text
          size="sm"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.gray[6]
                : theme.colors.gray[7],
          })}
        >
          {t("linked_sequences")}
        </Text>
        {cron.sequences.length ? (
          <Table mx="md" mt="sm" highlightOnHover striped>
            <thead>
              <tr>
                <th style={{ textAlign: "start" }}>{t("sequence")}</th>
                <th style={{ textAlign: "start" }}>{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {cron.sequences.map(({ id, name, active }) => (
                <tr
                  key={id}
                  onClick={() => router.push("/sequences/" + id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{name}</td>
                  <td>{active ? `${t("activated")}` : t("deactivated")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Text px="md" pt="sm">
            {t("no_linked_sequences")}
          </Text>
        )}
      </Flex>
      <Divider />
      <Flex direction={"column"} py="md">
        <Text
          size="sm"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.gray[6]
                : theme.colors.gray[7],
          })}
        >
          {t("next_trigger_dates")}
        </Text>
        <Table mx="md" mt="sm" highlightOnHover striped>
          <thead>
            <tr>
              <th style={{ textAlign: "start" }}>{t("date")}</th>
              <th style={{ textAlign: "start" }}>{t("time")}</th>
            </tr>
          </thead>
          <tbody>
            {nextCronDates(cron.cron, 10).map((d) => (
              <tr key={d.toString()}>
                <td>{d.toDateString()}</td>
                <td>{d.toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Flex>
    </>
  );
};

export default TriggerRow;
