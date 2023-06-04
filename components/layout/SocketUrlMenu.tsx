import { FC } from "react";
import { ActionIcon, Menu, useMantineTheme } from "@mantine/core";
import { usePrompt, useSocket } from "../context";
import { useTranslation } from "react-i18next";
import { Circle, DevicesPc } from "tabler-icons-react";

const SocketUrlMenu: FC<{ subMenu?: boolean }> = ({ subMenu }) => {
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const sContext = useSocket();
  const connected = !!sContext?.socket;
  const prompt = usePrompt();

  return subMenu ? (
    <>
      <Menu.Label>{connected ? t("connected") : t("disconnected")}</Menu.Label>
      <Menu.Item icon={<DevicesPc />} onClick={() => prompt?.changeSocket()}>
        {t("change-socket-url")}
      </Menu.Item>
    </>
  ) : (
    <Menu>
      <Menu.Target>
        <ActionIcon
          title={connected ? t("connected") : t("disconnected")}
          contextMenu="socket"
        >
          <Circle
            size={24}
            fill={connected ? theme.colors.green[7] : theme.colors.red[7]}
            stroke="0"
          />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>
          {connected ? t("connected") : t("disconnected")}
        </Menu.Label>
        <Menu.Item icon={<DevicesPc />} onClick={() => prompt?.changeSocket()}>
          {t("change-socket-url")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default SocketUrlMenu;
