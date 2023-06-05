import { Container, SimpleGrid } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { Channels, Triggers, Events } from "../components/device";

const Device: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("device_title")}</title>
      </Head>
      <Container size={"lg"} m="xs" p="sm">
        <SimpleGrid
          cols={2}
          spacing="lg"
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        >
          <Channels />
          <Events />
          <Triggers />
        </SimpleGrid>
      </Container>
    </>
  );
};

export default Device;
