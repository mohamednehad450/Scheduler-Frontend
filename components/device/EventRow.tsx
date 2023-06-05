import { Divider, Flex, Grid, Text } from "@mantine/core";
import { SequenceEvent } from "../common";
import { useTranslation } from "react-i18next";

function EventRow({ event }: { event: SequenceEvent }) {
  const { t } = useTranslation();
  return (
    <>
      <Flex h="2.5rem" w="100%" align={"center"} key={event.id}>
        <Grid
          px="sm"
          w="100%"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <Grid.Col span={6}>
            <Text>{new Date(event.date).toLocaleString()}</Text>
          </Grid.Col>
          <Grid.Col span={3}>
            <Text>{event.sequence.name}</Text>
          </Grid.Col>
          <Grid.Col span={3}>
            <Text>{t(event.eventType)}</Text>
          </Grid.Col>
        </Grid>
      </Flex>
      <Divider />
    </>
  );
}

export default EventRow;
