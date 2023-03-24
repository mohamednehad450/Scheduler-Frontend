import {
  Accordion,
  AccordionItem,
  Container,
  Divider,
  Group,
  ScrollArea,
  Tab,
  Table,
  Tabs,
  Text,
} from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { nextCronDates, Sequence } from "../common";

interface SequenceTriggersProps {
  cronTriggers: Sequence["crons"];
}

const SequenceTriggers: FC<SequenceTriggersProps> = ({ cronTriggers }) => {
  const { t } = useTranslation();

  return (
    <Container
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Group pt="xs">
        <Text size="xl">{t("triggers")}</Text>
      </Group>
      <Divider />
      <ScrollArea pt="xs" styles={{ root: { flex: 1 } }}>
        <Tabs>
          <Tab label={t("schedules")}>
            <Accordion>
              {cronTriggers.map(({ cron, label, id }) => (
                <AccordionItem
                  label={label}
                  iconPosition="right"
                  key={id}
                  styles={{
                    label: {
                      display: "flex",
                    },
                  }}
                >
                  <Table striped highlightOnHover>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "start" }}>{t("date")}</th>
                        <th style={{ textAlign: "start" }}>{t("time")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nextCronDates(cron, 5).map((d) => (
                        <tr key={d.toString()}>
                          <td>{d.toDateString()}</td>
                          <td>{d.toLocaleTimeString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </AccordionItem>
              ))}
            </Accordion>
          </Tab>
          <Tab label={t("sensors")} disabled></Tab>
        </Tabs>
      </ScrollArea>
    </Container>
  );
};

export default SequenceTriggers;
