import {
  Button,
  Divider,
  Group,
  ScrollArea,
  Switch,
  TextInput,
} from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pin, Sequence, LoadingButton } from "../common";
import { useCRUD } from "../context";
import OrdersInput, { OrderInput } from "./OrdersInput";
import {
  ContextModalProps,
  openConfirmModal,
  openContextModal,
} from "@mantine/modals";

type SequenceInput = {
  name: string;
  active: boolean;
  orders: OrderInput[];
};

interface SequenceModalProps {
  onChange: (seq: Sequence) => void;
  initialSequence?: Partial<Sequence>;
}

const SequenceModal: FC<ContextModalProps<SequenceModalProps>> = ({
  context,
  id,
  innerProps: { onChange, initialSequence },
}) => {
  const [sequence, setSequence] = useState<SequenceInput>({
    name: initialSequence?.name || "",
    active: initialSequence?.active || false,
    orders:
      initialSequence?.orders?.map(({ offset, duration, channel }) => ({
        offset,
        duration,
        channel,
      })) || [],
  });
  const [error, setError] = useState({
    name: "",
    orders: "",
  });
  const [pins, setPins] = useState<Pin[]>([]);

  const crud = useCRUD();

  const { t } = useTranslation();

  useEffect(() => {
    crud?.pinsCRUD?.list().then((d) => setPins(d.data));
  }, [crud]);

  useEffect(() => {
    setError({
      name: "",
      orders: "",
    });
  }, [sequence]);

  return (
    <>
      <Divider pt="md" />
      <ScrollArea>
        <Group p="xs">
          <TextInput
            required
            size="md"
            value={sequence.name}
            onChange={(e) =>
              setSequence((s) => ({ ...s, name: e.target.value }))
            }
            label={t("name")}
            error={error.name}
          />
          <Switch
            px="md"
            mt="xl"
            dir="ltr"
            checked={sequence.active}
            onChange={(e) =>
              setSequence((s) => ({ ...s, active: e.target.checked }))
            }
            label={t("active")}
          />
        </Group>
        <Group>
          <OrdersInput
            error={error.orders}
            orders={sequence.orders}
            pins={pins}
            onChange={(orders) => setSequence((s) => ({ ...s, orders }))}
          />
        </Group>
      </ScrollArea>
      <Group
        position="right"
        sx={(theme) => ({
          position: "sticky",
          bottom: 0,
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
        })}
      >
        <Button
          styles={{ root: { minWidth: "6rem" } }}
          m="sm"
          variant="subtle"
          onClick={() => context.closeModal(id)}
        >
          {t("cancel")}
        </Button>
        <LoadingButton
          styles={{ root: { minWidth: "6rem" } }}
          m="sm"
          onClick={(onDone) => {
            let err = false;
            if (!sequence.name) {
              setError((e) => ({ ...e, name: t("required_name") }));
              err = true;
            }
            if (sequence.orders.length < 1) {
              setError((e) => ({ ...e, orders: t("min_orders") }));
              err = true;
            }
            if (err) {
              onDone();
              return;
            }
            const func = initialSequence?.id
              ? crud?.sequenceCRUD?.update(initialSequence.id, sequence)
              : crud?.sequenceCRUD?.add(sequence);
            func &&
              func
                .then(({ data: newSeq }) => {
                  if (initialSequence) {
                    onChange(newSeq);
                    context.closeModal(id);
                  } else {
                    openConfirmModal({
                      title: t("link_sequence_schedule"),
                      centered: true,
                      labels: {
                        cancel: t("cancel"),
                        confirm: t("confirm"),
                      },
                      onConfirm: () => {
                        openContextModal({
                          modal: "LinkSequenceModal",
                          title: t("link_schedules"),
                          centered: true,
                          innerProps: {
                            onChange: (seq) => {
                              onChange(seq);
                              context.closeModal(id);
                            },
                            sequenceId: newSeq.id,
                          },
                        });
                      },
                      onCancel: () => {
                        onChange(newSeq);
                        context.closeModal(id);
                      },
                    });
                  }
                })
                .catch((err) => {
                  // TODO
                })
                .finally(() => onDone());
          }}
        >
          {t("submit")}
        </LoadingButton>
      </Group>
    </>
  );
};

export default SequenceModal;
