import { ActionIcon, Menu } from "@mantine/core";
import { useRouter } from "next/router";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Language } from "tabler-icons-react";

const LanguageMenu: FC<{ subMenu?: boolean }> = ({ subMenu }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  return subMenu ? (
    <>
      <Menu.Label>{t("lang")}</Menu.Label>
      <Menu.Item
        onClick={() => i18n.changeLanguage("ar")}
        disabled={router.locale === "ar"}
      >
        {"العربية"}
      </Menu.Item>
      <Menu.Item
        onClick={() => i18n.changeLanguage("en")}
        disabled={router.locale === "en"}
      >
        {"English"}
      </Menu.Item>
    </>
  ) : (
    <Menu>
      <Menu.Target>
        <ActionIcon title={t("lang")}>
          <Language />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{t("lang")}</Menu.Label>
        <Menu.Item
          onClick={() => i18n.changeLanguage("ar")}
          disabled={router.locale === "ar"}
        >
          {"العربية"}
        </Menu.Item>
        <Menu.Item
          onClick={() => i18n.changeLanguage("en")}
          disabled={router.locale === "en"}
        >
          {"English"}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageMenu;
