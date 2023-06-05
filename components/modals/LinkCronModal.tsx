import { Button, Group, MultiSelect } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cron, Sequence } from "../common";
import { useCRUD } from "../context";
import { ContextModalProps } from "@mantine/modals";

interface LinkCronProps {
  onChange: (cron: Cron) => void;
  cronId: Cron["id"];
  initialSequences?: Sequence["id"][];
}

const LinkCronModal: FC<ContextModalProps<LinkCronProps>> = ({
  context,
  id,
  innerProps: { onChange, initialSequences, cronId },
}) => {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [sequencesIds, setSequencesIds] = useState<Sequence["id"][]>(
    initialSequences || []
  );

  const crud = useCRUD();

  const { t } = useTranslation();

  useEffect(() => {
    crud?.sequenceCRUD?.list().then(({ data }) => setSequences(data));
    setSequencesIds(initialSequences || []);
  }, [crud]);

  return (
    <>
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
        <Button variant="subtle" onClick={() => context.closeModal(id)}>
          {t("cancel")}
        </Button>
        <Button
          onClick={() =>
            crud?.cronSequence?.linkCron(cronId, sequencesIds).then((r) => {
              r.data && onChange(r.data);
              r.data && context.closeModal(id);
            })
          }
        >
          {t("submit")}
        </Button>
      </Group>
    </>
  );
};

export default LinkCronModal;
