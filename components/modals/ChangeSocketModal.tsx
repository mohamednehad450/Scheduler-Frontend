import { Button, Group, Modal, TextInput } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSocket } from "../context";

const ChangeSocketModal: FC<{ onDone: () => void; opened: boolean }> = ({
  onDone,
  opened,
}) => {
  const { t } = useTranslation();

  const sContext = useSocket();
  const [sUrl, setSUrl] = useState(sContext?.url[0] || "");

  useEffect(() => {
    setSUrl(sContext?.url[0] || "");
  }, [opened]);

  return (
    <Modal
      title={t("change-socket-url")}
      opened={opened}
      onClose={() => onDone()}
    >
      <form>
        <TextInput value={sUrl} onChange={(s) => setSUrl(s.target.value)} />
        <Group py={"md"} position="right">
          <Button variant="subtle" onClick={() => onDone()}>
            {t("cancel")}
          </Button>
          <Button
            onClick={() => {
              sContext?.url[1](sUrl);
              onDone();
            }}
          >
            {t("submit")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ChangeSocketModal;
