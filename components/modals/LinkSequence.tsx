import { Button, Group, Modal, MultiSelect } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cron, Sequence } from "../common";
import { useCRUD, usePrompt } from "../context";

interface LinkSequenceProps {
  opened: boolean;
  onClose: (seq?: Sequence) => void;
  sequenceId: Sequence["id"];
  initialCrons?: Cron["id"][];
}

const LinkSequence: FC<LinkSequenceProps> = ({
  opened,
  onClose,
  initialCrons,
  sequenceId,
}) => {
  const [crons, setCrons] = useState<Cron[]>([]);
  const [cronsIds, setCronsIds] = useState<Cron["id"][]>(initialCrons || []);

  const prompt = usePrompt();
  const crud = useCRUD();

  const { t } = useTranslation();

  useEffect(() => {
    if (opened) {
      crud?.cronCRUD?.list().then(({ data }) => setCrons(data));
      setCronsIds(initialCrons || []);
    }
  }, [opened, crud]);

  return (
    <Modal
      title={t("link_schedules")}
      opened={opened}
      onClose={() => onClose()}
      size="lg"
      overflow="inside"
    >
      <MultiSelect
        size="md"
        data={crons.map((c) => ({ value: String(c.id), label: c.label })) || []}
        value={cronsIds.map(String)}
        label={t("schedules")}
        placeholder={`${t("select_schedules")}`}
        onChange={(cronsIds) => setCronsIds(cronsIds.map(Number))}
      />
      <Button
        my="md"
        variant="subtle"
        onClick={() => {
          onClose();
          prompt?.newCron((cron) => {
            cron
              ? prompt.linkSequence(onClose, sequenceId, [
                  cron.id,
                  ...(initialCrons || []),
                ])
              : prompt.linkSequence(onClose, sequenceId, initialCrons);
          });
        }}
      >
        {t("link_new_schedule")}
      </Button>
      <Group p={"md"} position="right">
        <Button variant="subtle" onClick={() => onClose()}>
          {t("cancel")}
        </Button>
        <Button
          onClick={() =>
            crud?.cronSequence
              ?.linkSequence(sequenceId, cronsIds)
              .then((r) => onClose(r.data))
          }
        >
          {t("submit")}
        </Button>
      </Group>
    </Modal>
  );
};

export default LinkSequence;
