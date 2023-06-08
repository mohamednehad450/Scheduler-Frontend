import { Button, Group, TextInput } from "@mantine/core";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSocket } from "../context";
import { ContextModalProps } from "@mantine/modals";

const SocketURLModal: FC<ContextModalProps<{}>> = ({ id, context }) => {
  const { t } = useTranslation();

  const sContext = useSocket();
  const [sUrl, setSUrl] = useState(sContext?.url[0] || "");

  return (
    <form>
      <TextInput
        size="md"
        value={sUrl}
        onChange={(s) => setSUrl(s.target.value)}
      />
      <Group pt={"md"} position="right">
        <Button variant="subtle" onClick={() => context.closeModal(id)}>
          {t("cancel")}
        </Button>
        <Button
          onClick={() => {
            sContext?.url[1](sUrl);
            context.closeModal(id);
          }}
        >
          {t("submit")}
        </Button>
      </Group>
    </form>
  );
};

export default SocketURLModal;
