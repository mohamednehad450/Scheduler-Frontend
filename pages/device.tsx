import { Grid, Container, Card } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { Channels, CronTriggers, Events } from "../components/device";

const g = {
  sm: 12,
  md: 6,
  lg: 6,
  xl: 6,
  span: 12,
};

const Device: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("device_title")}</title>
      </Head>
      <Container size={"lg"} m="sm" p="sm">
        <Grid gutter="md">
          <Grid.Col {...g}>
            <Card shadow="lg" p="xs" radius={"md"} style={{ height: "26rem" }}>
              <Channels />
            </Card>
          </Grid.Col>
          <Grid.Col {...g}>
            <Card shadow="lg" p="xs" radius={"md"} style={{ height: "26rem" }}>
              <Events />
            </Card>
          </Grid.Col>
          <Grid.Col {...g}>
            <Card shadow="lg" p="xs" radius={"md"} style={{ height: "26rem" }}>
              <CronTriggers />
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};

export default Device;
