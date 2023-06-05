import {
  ActionIcon,
  Divider,
  Flex,
  Grid,
  Menu,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Circle, Dots, Edit, Trash } from "tabler-icons-react";
import { Pin } from "../common";
import { openConfirmModal, openContextModal } from "@mantine/modals";
import { useMediaQuery } from "@mantine/hooks";

interface ChannelRowProps {
  pin: Pin;
  isRunning: boolean;
  remove: (id: Pin["channel"]) => void;
  onChange: (pin: Pin) => void;
}

const ChannelRow: FC<ChannelRowProps> = ({
  pin,
  isRunning,
  remove,
  onChange,
}) => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const edit = () =>
    openContextModal({
      modal: "PinModal",
      title: pin.label,
      fullScreen: isMobile,
      innerProps: {
        initialPin: pin,
        onChange,
        usedPins: {},
      },
    });

  return (
    <>
      <Flex align={"center"} h="2.5rem">
        <Grid w="100%" px="sm" style={{ textAlign: "center" }}>
          <Grid.Col span={4}>
            <Text
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "start",
              }}
              size="sm"
            >
              {pin.label}
            </Text>
          </Grid.Col>
          <Grid.Col span={2}>
            <Text size="sm">{pin.channel}</Text>
          </Grid.Col>
          <Grid.Col span={2}>
            <Text size="sm">{pin.onState}</Text>
          </Grid.Col>
          <Grid.Col span={2}>
            <ThemeIcon
              radius={"lg"}
              size={12}
              color={isRunning ? "green" : "red"}
            >
              <Circle stroke="0" />
            </ThemeIcon>
          </Grid.Col>
          <Grid.Col span={2}>
            <Menu>
              <Menu.Target>
                <ActionIcon>
                  <Dots />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={edit} icon={<Edit size={16} />}>
                  {t("edit")}
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    openConfirmModal({
                      title: t("are_you_sure"),
                      centered: true,
                      labels: {
                        cancel: t("cancel"),
                        confirm: t("confirm"),
                      },
                      onConfirm: () => remove(pin.channel),
                    })
                  }
                  color={"red"}
                  icon={<Trash size={16} />}
                >
                  {t("delete")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Grid.Col>
        </Grid>
      </Flex>
      <Divider />
    </>
  );
};

export default ChannelRow;
