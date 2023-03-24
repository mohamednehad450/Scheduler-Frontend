import { FC } from "react";
import {
  ActionIcon,
  Menu,
  MenuItem,
  MenuLabel,
  useMantineTheme,
} from "@mantine/core";
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
      <MenuLabel>{connected ? t("connected") : t("disconnected")}</MenuLabel>
      <MenuItem icon={<DevicesPc />} onClick={() => prompt?.changeSocket()}>
        {t("change-socket-url")}
      </MenuItem>
    </>
  ) : (
    <Menu
      control={
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
      }
    >
      <MenuLabel>{connected ? t("connected") : t("disconnected")}</MenuLabel>
      <MenuItem icon={<DevicesPc />} onClick={() => prompt?.changeSocket()}>
        {t("change-socket-url")}
      </MenuItem>
    </Menu>
  );
};

export default SocketUrlMenu;
