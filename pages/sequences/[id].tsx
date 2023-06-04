import { Container, Grid, LoadingOverlay, Title } from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Pin, Sequence } from "../../components/common";
import {
  OrdersPreview,
  SequenceActions,
  SequenceActivities,
  SequenceTriggers,
} from "../../components/sequences";
import { useCRUD } from "../../components/context";
import { useTranslation } from "react-i18next";

const Sequence: NextPage = () => {
  const router = useRouter();
  const [sequence, setSequence] = useState<Sequence>();
  const [pins, setPins] = useState<Pin[]>();

  const crud = useCRUD();
  const { t } = useTranslation();

  useEffect(() => {
    if (!router.query.id) return;
    if (Array.isArray(router.query.id)) {
      router.push("/sequences");
      return;
    }
    const id = router.query.id;
    crud?.sequenceCRUD
      ?.get(Number(id))
      .then((d) => {
        d.data ? setSequence(d.data) : router.push("/sequences/");
      })
      .catch((err) => {
        router.push("/sequences");
        return;
      });
    crud?.pinsCRUD?.list().then((r) => setPins(r.data));
  }, [router.query, crud]);

  return (
    <>
      <Head>
        <title>
          ({sequence?.name}) - {t("scheduler")}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {sequence ? (
        <Container size={"lg"} m="sm" p="sm">
          <Title p={"lg"}>{sequence?.name}</Title>
          <Grid gutter="md">
            <Grid.Col span={12} xl={8}>
              <OrdersPreview orders={sequence?.orders || []} pins={pins} />
            </Grid.Col>
            <Grid.Col span={12} lg={6} xl={4}>
              <SequenceActions
                sequence={sequence}
                onChange={(seq) => setSequence(seq)}
              />
            </Grid.Col>
            <Grid.Col span={12} lg={6} xl={4}>
              <SequenceTriggers cronTriggers={sequence.crons} />
            </Grid.Col>
            <Grid.Col span={12} lg={6} xl={4}>
              <SequenceActivities sequence={sequence} />
            </Grid.Col>
          </Grid>
        </Container>
      ) : (
        <LoadingOverlay visible={true} />
      )}
    </>
  );
};

export default Sequence;
