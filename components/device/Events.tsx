import {
  ActionIcon,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  LoadingOverlay,
  Pagination,
  ScrollArea,
  Text,
} from "@mantine/core";
import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Refresh, Trash } from "tabler-icons-react";
import { Pagination as Page } from "../../api";
import { SequenceEvent } from "../common";
import { useCRUD } from "../context";
import EventRow from "./EventRow";
import { openConfirmModal } from "@mantine/modals";

const Events: FC = () => {
  const [events, setEvents] = useState<{
    events: SequenceEvent[];
    page?: Page;
  }>({ events: [] });
  const [loading, setLoading] = useState(true);
  const viewport = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const crud = useCRUD();

  useEffect(() => {
    crud?.sequenceEvents
      ?.listAll()
      .then(({ data }) => {
        setEvents(data);
      })
      .catch((err) => {
        // TODO
      })
      .finally(() => {
        setLoading(false);
      });
  }, [crud]);

  return (
    <Card h="26rem" shadow="sm" p={"0"} radius={"md"}>
      <Flex justify={"space-between"} align={"center"} h="3rem" px="sm">
        <Text weight={500} size="lg">
          {t("events")}
        </Text>
        <Flex align={"center"} gap={"lg"}>
          <ActionIcon
            size={24}
            onClick={() => {
              setLoading(true);
              crud?.sequenceEvents
                ?.listAll({ page: events.page?.current || 0 })
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
              openConfirmModal({
                title: t("clear_events"),
                centered: true,
                labels: { cancel: t("cancel"), confirm: t("confirm") },
                onConfirm: () =>
                  crud?.sequenceEvents
                    ?.deleteAll()
                    .then((d) => {
                      setEvents({ events: [] });
                    })
                    .catch((err) => {
                      // TODO
                    }),
              })
            }
          >
            <Trash size={24} />
          </ActionIcon>
        </Flex>
      </Flex>
      <Divider />
      {events.events.length ? (
        <>
          <Flex align={"center"} justify={"end"} h="3rem" px="sm">
            <Pagination
              total={Math.round(
                (events.page?.total || 0) / (events.page?.perPage || 1)
              )}
              siblings={0}
              onChange={(page) => {
                setLoading(true);
                crud?.sequenceEvents
                  ?.listAll({ page })
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
          <Divider />
          <ScrollArea m="0" p="0" h="17rem" viewportRef={viewport}>
            <LoadingOverlay visible={loading} />
            {events.events.map((e) => (
              <EventRow event={e} key={e.id} />
            ))}
          </ScrollArea>
          <Divider />
          <Flex h={"3rem"} align={"center"} justify={"stretch"}>
            <Grid
              p="sm"
              w="100%"
              sx={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <Grid.Col span={6}>
                <Text size="sm">{t("date")}</Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <Text size="sm">{t("sequence")}</Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <Text size="sm">{t("event")}</Text>
              </Grid.Col>
            </Grid>
          </Flex>
        </>
      ) : (
        <Center h="23rem">
          <Text>{t("no_events")}</Text>
        </Center>
      )}
    </Card>
  );
};

export default Events;
