import { FC } from "react";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Moon, Sun } from "tabler-icons-react";

const ThemeToggle: FC = () => {
  const { t } = useTranslation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      title={colorScheme === "light" ? t("dark-mode") : t("light-mode")}
    >
      {colorScheme === "light" ? <Moon /> : <Sun />}
    </ActionIcon>
  );
};

export default ThemeToggle;
