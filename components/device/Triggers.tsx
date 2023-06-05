import {
  Accordion,
  ActionIcon,
  Button,
  Card,
  Divider,
  Flex,
  ScrollArea,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Refresh } from "tabler-icons-react";
import { Cron } from "../common";
import { useCRUD } from "../context";
import TriggerRow from "./TriggerRow";
import { openContextModal } from "@mantine/modals";
import { useMediaQuery } from "@mantine/hooks";

const Triggers: FC = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [crons, setCrons] = useState<Cron[]>([]);

  const crud = useCRUD();

  const refresh = useCallback(
    () => crud?.cronCRUD?.list().then((d) => setCrons(d.data)),
    [crud]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Card h="26rem" shadow="sm" p={"0"} radius={"md"}>
      <Flex justify={"space-between"} align={"center"} h="3rem" px="sm">
        <Text weight={500} size="lg">
          {t("schedules")}
        </Text>
        <Flex align={"center"} gap={"sm"}>
          <ActionIcon size={24} onClick={refresh}>
            <Refresh size={24} />
          </ActionIcon>
          <ActionIcon
            size={24}
            onClick={() =>
              openContextModal({
                modal: "CronModal",
                title: t("add_new_schedule"),
                fullScreen: isMobile,
                size: "lg",
                innerProps: {
                  onChange: (cron) => setCrons((cs) => [cron, ...cs]),
                },
              })
            }
          >
            <Plus size={24} />
          </ActionIcon>
        </Flex>
      </Flex>
      <Divider />
      {crons.length ? (
        <>
          <ScrollArea h="23rem" p="0">
            <Accordion>
              {crons.map((cron, i) => (
                <Accordion.Item key={cron.id} value={String(cron.id)}>
                  <Accordion.Control>{cron.label}</Accordion.Control>
                  <Accordion.Panel>
                    <TriggerRow
                      cron={cron}
                      onChange={(newCron) => {
                        setCrons((crons) => {
                          crons[i] = newCron;
                          return [...crons];
                        });
                      }}
                      remove={(id) =>
                        crud?.cronCRUD
                          ?.remove(id)
                          .then(() =>
                            setCrons((cs) => cs.filter((c) => c.id !== id))
                          )
                          .catch((err) => {
                            // TODO
                          })
                      }
                    />
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </ScrollArea>
        </>
      ) : (
        <Flex
          h="23rem"
          direction={"column"}
          align={"center"}
          justify={"center"}
        >
          <Text>{t("no_schedules_defined")}</Text>
          <Button
            onClick={() =>
              openContextModal({
                modal: "CronModal",
                title: t("add_new_schedule"),
                size: "lg",
                fullScreen: isMobile,
                innerProps: {
                  onChange: (cron) => setCrons((cs) => [cron, ...cs]),
                },
              })
            }
            variant="subtle"
          >
            {t("add_new_schedule")}
          </Button>
        </Flex>
      )}
    </Card>
  );
};

export default Triggers;
