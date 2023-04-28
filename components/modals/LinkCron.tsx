import { Button, Group, Modal, MultiSelect } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cron, Sequence } from "../common";
import { useCRUD } from "../context";

interface LinkCronProps {
  opened: boolean;
  onClose: (cron?: Cron) => void;
  cronId: Cron["id"];
  initialSequences?: Sequence["id"][];
}

const LinkCron: FC<LinkCronProps> = ({
  opened,
  onClose,
  initialSequences,
  cronId,
}) => {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [sequencesIds, setSequencesIds] = useState<Sequence["id"][]>(
    initialSequences || []
  );

  const crud = useCRUD();

  const { t } = useTranslation();

  useEffect(() => {
    if (opened) {
      crud?.sequenceCRUD?.list().then(({ data }) => setSequences(data));
      setSequencesIds(initialSequences || []);
    }
  }, [opened, crud]);

  return (
    <Modal
      title={t("link_sequences")}
      opened={opened}
      onClose={() => onClose()}
      size="lg"
      overflow="inside"
    >
      <MultiSelect
        size="md"
        data={
          sequences.map((c) => ({ value: String(c.id), label: c.name })) || []
        }
        value={sequencesIds.map(String)}
        label={t("sequences")}
        placeholder={`${t("select_sequences")}`}
        onChange={(SequencesIds) => setSequencesIds(SequencesIds.map(Number))}
      />
      <Group p={"md"} position="right">
        <Button variant="subtle" onClick={() => onClose()}>
          {t("cancel")}
        </Button>
        <Button
          onClick={() =>
            crud?.cronSequence
              ?.linkCron(cronId, sequencesIds)
              .then((r) => onClose(r.data))
          }
        >
          {t("submit")}
        </Button>
      </Group>
    </Modal>
  );
};

export default LinkCron;
