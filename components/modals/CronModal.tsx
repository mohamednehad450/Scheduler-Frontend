import {
  Button,
  Divider,
  Group,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { Cron } from "../common";
import cronstrue from "cronstrue";
import CronInput from "./CronInput";
import { useCRUD } from "../context";
import { useTranslation } from "react-i18next";
import { ContextModalProps } from "@mantine/modals";

interface CronModalProps {
  onChange: (cron: Cron) => void;
  initCron?: Cron;
}

const CronModal: FC<ContextModalProps<CronModalProps>> = ({
  context,
  id,
  innerProps: { onChange, initCron },
}) => {
  const theme = useMantineTheme();
  const crud = useCRUD();

  const { t, i18n } = useTranslation();

  const [label, setLabel] = useState(initCron?.label || "");
  const [cron, setCron] = useState(initCron?.cron || "* * * * *");

  const [err, setErr] = useState({
    label: "",
  });

  useEffect(() => {
    !label && setErr({ label: "" });
  }, [label]);

  return (
    <>
      <TextInput
        p="md"
        label={t("label")}
        description={t("schedule_label")}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        error={err.label}
        required
      />
      <Divider />
      <CronInput initCron={cron} onChange={setCron} />
      <Divider />
      <Group
        p="md"
        style={{
          zIndex: 1,
          position: "sticky",
          top: 0,
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
        }}
      >
        <Text size="sm" color={"gray"}>
          {t("preview")}
        </Text>
        <Group px="sm">
          <Text size="lg">
            {cronstrue.toString(cron, {
              monthStartIndexZero: true,
              locale: i18n.language,
            })}
          </Text>
        </Group>
      </Group>
      <Group p={"md"} position="right">
        <Button variant="subtle" onClick={() => context.closeModal(id)}>
          {t("cancel")}
        </Button>
        <Button
          onClick={() => {
            if (!label) {
              setErr({ label: t("required_name") });
              return;
            }

            const func = async () =>
              initCron
                ? crud?.cronCRUD?.update(initCron.id, { label, cron })
                : crud?.cronCRUD?.add({ label, cron });

            func &&
              func()
                .then((d) => {
                  d?.data && onChange(d.data);
                  d?.data && context.closeModal(id);
                })
                .catch((err) => {
                  // TODO
                });
          }}
        >
          {t("submit")}
        </Button>
      </Group>
    </>
  );
};

export default CronModal;
