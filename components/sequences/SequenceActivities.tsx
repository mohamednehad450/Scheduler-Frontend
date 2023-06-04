import {
  Divider,
  ScrollArea,
  Table,
  Text,
  ActionIcon,
  LoadingOverlay,
  useMantineTheme,
  Pagination,
  Card,
  Flex,
} from "@mantine/core";
import { FC, useEffect, useRef, useState } from "react";
import { Refresh, Trash } from "tabler-icons-react";
import { usePrompt } from "../context";
import type { Sequence, SequenceEvent } from "../common";
import { useCRUD } from "../context";
import { useTranslation } from "react-i18next";
import { Pagination as Page } from "../../api";

interface SequenceActivitiesProps {
  sequence: Sequence;
}

const SequenceActivities: FC<SequenceActivitiesProps> = ({ sequence }) => {
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<{
    events: SequenceEvent[];
    page?: Page;
  }>({ events: [] });

  const prompt = usePrompt();
  const viewport = useRef<HTMLDivElement>(null);

  const crud = useCRUD();

  const { t } = useTranslation();

  useEffect(() => {
    crud?.sequenceEvents
      ?.listById(sequence.id, { page: events.page?.current || 1 })
      .then((d) => d.data && setEvents(d.data))
      .catch((err) => {
        //TODO
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sequence, crud]);
  return (
    <Card shadow="lg" p="0" radius={"md"} h="18rem">
      <Flex justify={"space-between"} align={"center"} p="xs" pb="0">
        <Text weight={500} size="lg">
          {t("activities")}
        </Text>
        <Flex align={"center"} gap={"sm"}>
          <ActionIcon
            size={24}
            onClick={() => {
              setLoading(true);
              crud?.sequenceEvents
                ?.listById(sequence.id, { page: events.page?.current || 1 })
                .then((d) => {
                  setEvents(d.data);
                })
                .catch((err) => {
                  // TODO
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            <Refresh size={24} />
          </ActionIcon>
          <ActionIcon
            color="red"
            size={24}
            onClick={() =>
              prompt?.confirm(
                (confirmed) =>
                  confirmed &&
                  crud?.sequenceEvents
                    ?.deleteById(sequence.id)
                    .then((d) => {
                      setEvents({ events: [] });
                    })
                    .catch((err) => {
                      // TODO
                    }),
                `${t("clear_sequence_events")}`
              )
            }
          >
            <Trash size={24} />
          </ActionIcon>
        </Flex>
      </Flex>
      <Divider />
      {events.events.length ? (
        <>
          <Flex h="3rem" px="xs" justify={"end"}>
            <Pagination
              total={Math.round(
                (events.page?.total || 0) / (events.page?.perPage || 1)
              )}
              onChange={(page) => {
                setLoading(true);
                crud?.sequenceEvents
                  ?.listById(sequence.id, { page })
                  .then((d) => {
                    setEvents(d.data);
                    viewport?.current?.scrollTo({ top: 0, behavior: "smooth" });
                  })
                  .catch((err) => {
                    // TODO
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
            />
          </Flex>
          <ScrollArea viewportRef={viewport} p="0" h="12.5rem">
            <Table highlightOnHover striped>
              <tbody>
                {events.events.map((e) => (
                  <tr key={e.id}>
                    <td>{new Date(e.date).toLocaleString()}</td>
                    <td>{t(e.eventType)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot
                style={{
                  backgroundColor:
                    theme.colorScheme === "light"
                      ? "white"
                      : theme.colors.dark[4],
                  position: "sticky",
                  bottom: 0,
                }}
              >
                <tr>
                  <th style={{ textAlign: "start" }}>{t("date")}</th>
                  <th style={{ textAlign: "start" }}>{t("event")}</th>
                </tr>
              </tfoot>
            </Table>
          </ScrollArea>
        </>
      ) : (
        <Flex h="15.5rem" align={"center"} justify={"center"}>
          <Text>{t("zero_activities")}</Text>
        </Flex>
      )}
      <LoadingOverlay visible={loading} />
    </Card>
  );
};

export default SequenceActivities;
