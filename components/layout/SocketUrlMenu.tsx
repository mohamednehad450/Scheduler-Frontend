import { FC } from "react";
import { ActionIcon, Menu, useMantineTheme } from "@mantine/core";
import { useSocket } from "../context";
import { useTranslation } from "react-i18next";
import { Circle, DevicesPc } from "tabler-icons-react";
import { openContextModal } from "@mantine/modals";

const SocketUrlMenu: FC<{ subMenu?: boolean }> = ({ subMenu }) => {
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const sContext = useSocket();
  const connected = !!sContext?.socket;

  return subMenu ? (
    <>
      <Menu.Label>{connected ? t("connected") : t("disconnected")}</Menu.Label>
      <Menu.Item
        icon={<DevicesPc />}
        onClick={() =>
          openContextModal({
            modal: "SocketURLModal",
            title: t("change-socket-url"),
            centered: true,
            innerProps: {},
          })
        }
      >
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
        <Menu.Item
          icon={<DevicesPc />}
          onClick={() =>
            openContextModal({
              modal: "SocketURLModal",
              title: t("change-socket-url"),
              centered: true,
              innerProps: {},
            })
          }
        >
          {t("change-socket-url")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default SocketUrlMenu;
