import { Button, Group, MultiSelect, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cron, Sequence } from "../common";
import { useCRUD } from "../context";
import { ContextModalProps, openContextModal } from "@mantine/modals";
import { useMediaQuery } from "@mantine/hooks";

interface LinkSequenceProps {
  onChange: (seq: Sequence) => void;
  sequenceId: Sequence["id"];
  initialCrons?: Cron["id"][];
}

const LinkSequenceModal: FC<ContextModalProps<LinkSequenceProps>> = ({
  context,
  id,
  innerProps: { onChange, initialCrons, sequenceId },
}) => {
  const [crons, setCrons] = useState<Cron[]>([]);
  const [cronsIds, setCronsIds] = useState<Cron["id"][]>(initialCrons || []);

  const crud = useCRUD();

  const { t } = useTranslation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  useEffect(() => {
    crud?.cronCRUD?.list().then(({ data }) => setCrons(data));
    setCronsIds(initialCrons || []);
  }, [crud]);

  return (
    <>
      <MultiSelect
        size="md"
        data={crons.map((c) => ({ value: String(c.id), label: c.label })) || []}
        value={cronsIds.map(String)}
        label={t("schedules")}
        placeholder={`${t("select_schedules")}`}
        onChange={(cronsIds) => setCronsIds(cronsIds.map(Number))}
      />
      <Button
        mt="md"
        variant="subtle"
        onClick={() => {
          openContextModal({
            modal: "CronModal",
            title: t("add_new_schedule"),
            fullScreen: isMobile,
            size: "lg",
            centered: true,
            innerProps: {
              onChange: (cron) => {
                setCrons((cs) => [cron, ...cs]);
                setCronsIds((cs) => [cron.id, ...cs]);
              },
            },
          });
        }}
      >
        {t("link_new_schedule")}
      </Button>
      <Group pt={"md"} position="right">
        <Button variant="subtle" onClick={() => context.closeModal(id)}>
          {t("cancel")}
        </Button>
        <Button
          onClick={() =>
            crud?.cronSequence?.linkSequence(sequenceId, cronsIds).then((r) => {
              onChange(r.data);
              context.closeModal(id);
            })
          }
        >
          {t("submit")}
        </Button>
      </Group>
    </>
  );
};

export default LinkSequenceModal;
