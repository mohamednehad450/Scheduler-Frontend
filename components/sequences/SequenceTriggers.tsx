import {
  Accordion,
  Card,
  Divider,
  ScrollArea,
  Table,
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
    <Card shadow="lg" p="0" radius={"md"} h="18rem">
      <Text weight={500} size="lg" p="xs" pb="0">
        {t("schedules")}
      </Text>
      <Divider />
      <ScrollArea p="0" h="15.5rem">
        <Accordion>
          {cronTriggers.map(({ cron, label, id }) => (
            <Accordion.Item value={String(id)} key={id}>
              <Accordion.Control h="3rem">
                <Text>{label}</Text>
              </Accordion.Control>
              <Accordion.Panel>
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
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </ScrollArea>
    </Card>
  );
};

export default SequenceTriggers;
