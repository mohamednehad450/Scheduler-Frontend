import {
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Text,
} from "@mantine/core";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

interface DurationInputProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (ms: number) => void;
}

const DurationInput: FC<DurationInputProps> = ({
  opened,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const [duration, setDuration] = useState({
    h: 0,
    m: 0,
    s: 0,
    ms: 0,
  });

  return (
    <Modal
      title={t("custom_length")}
      centered
      opened={opened}
      onClose={onClose}
      zIndex={99999}
    >
      <Divider />
      <Group pt="md">
        <NumberInput
          label={t("hour")}
          styles={{ root: { width: "4rem" } }}
          size="md"
          defaultValue={0}
          hideControls
          step={1}
          value={duration.h}
          min={0}
          onChange={(h) => setDuration((d) => ({ ...d, h: h || 0 }))}
        />
        <Text pt="xl">:</Text>
        <NumberInput
          label={t("minute")}
          size="md"
          min={0}
          max={59}
          styles={{ root: { width: "4rem" } }}
          defaultValue={0}
          hideControls
          step={1}
          value={duration.m}
          onChange={(m) => setDuration((d) => ({ ...d, m: m || 0 }))}
        />
        <Text pt="xl">:</Text>
        <NumberInput
          label={t("second")}
          size="md"
          min={0}
          max={59}
          styles={{ root: { width: "4rem" } }}
          defaultValue={0}
          hideControls
          step={1}
          value={duration.s}
          onChange={(s) => setDuration((d) => ({ ...d, s: s || 0 }))}
        />
        <Text pt="xl">.</Text>
        <NumberInput
          label={t("ms")}
          min={0}
          max={1000}
          size="md"
          styles={{ root: { width: "4rem" } }}
          defaultValue={0}
          hideControls
          step={10}
          value={duration.ms}
          onChange={(ms) => setDuration((d) => ({ ...d, ms: ms || 0 }))}
        />
      </Group>
      <Group pt="xl">
        <Button variant="subtle" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          onClick={() => {
            onSubmit(
              duration.h * 60 * 60 * 1000 +
                duration.m * 60 * 1000 +
                duration.s * 1000 +
                duration.ms
            );
          }}
        >
          {t("submit")}
        </Button>
      </Group>
    </Modal>
  );
};

export default DurationInput;
