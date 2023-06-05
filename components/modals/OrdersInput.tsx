import { ActionIcon, Group, Select } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "tabler-icons-react";
import { Pin } from "../common";
import DurationInput from "./DurationInput";
import TrackInput from "./TrackInput";

export type OrderInput = {
  channel: Pin["channel"];
  duration: number;
  offset: number;
};

type timeLabel = {
  ms: string;
  sec: string;
  min: string;
  h: string;
};

interface OrdersInputProps {
  orders: OrderInput[];
  pins: Pin[];
  onChange: (os: OrderInput[]) => void;
  error?: string;
}

const { round } = Math;

const formatDuration = (time: number, { ms }: timeLabel) => {
  if (time < 1) return "00:00";
  if (time <= 1000) return Math.round(time) + ` ${ms}`;
  const t = time / 1000;
  const cm = Math.floor((time % 1000) / 10);
  const s = Math.floor(t % 60);
  const m = Math.floor(t / 60);
  return `${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}.${
    cm > 9 ? cm : "0" + cm
  }`;
};

const formatTimeLabel = (
  time: number,
  { sec, min, h, ms }: timeLabel
): string => {
  if (!time) return "0";
  if (time < 1000) return `${time} ${ms}`;
  if (time < 1000 * 60) return `${round(time / 1000)} ${sec}`;
  if (time < 1000 * 60 * 60) return `${round(time / (1000 * 60))} ${min}`;
  return `${round(time / (1000 * 60 * 60))} ${h}`;
};

const update = (
  map: { [key: Pin["channel"]]: [number, number][] },
  maxX: number
): OrderInput[] =>
  [...Object.keys(map)].flatMap((channel) =>
    map[Number(channel)].map(([x1, x2]) => ({
      channel: Number(channel),
      duration: Math.round((x2 - x1) * maxX),
      offset: Math.round(x1 * maxX),
    }))
  );

const genDefaultSequenceLength = ({ sec, min, h }: timeLabel) => [
  { value: String(1000), label: `1 ${sec}` },
  { value: String(1000 * 60), label: `1 ${min}` },
  { value: String(1000 * 60 * 30), label: `30 ${min}` },
  { value: String(1000 * 60 * 60), label: `1 ${h}` },
];

const genSteps = ({ sec, min, ms }: timeLabel) => [
  { value: String(10), label: `10 ${ms}` },
  { value: String(100), label: `100 ${ms}` },
  { value: String(500), label: `500 ${ms}` },
  { value: String(1000), label: `1 ${sec}` },
  { value: String(1000 * 10), label: `10 ${sec}` },
  { value: String(1000 * 15), label: `15 ${sec}` },
  { value: String(1000 * 30), label: `30 ${sec}` },
  { value: String(1000 * 60), label: `1 ${min}` },
];

const sortOrder = (a: [number, number], b: [number, number]) =>
  a[0] > b[0] ? 1 : -1;

const OrdersInput: FC<OrdersInputProps> = ({
  orders,
  onChange,
  error,
  pins,
}) => {
  const { t } = useTranslation();

  const timeLabel = {
    min: t("minute"),
    sec: t("second"),
    h: t("hour"),
    ms: t("ms"),
  };

  const defaultSequenceLength = genDefaultSequenceLength(timeLabel);
  const steps = genSteps(timeLabel);

  const [channelMap, setChannelMap] = useState<{
    [key: Pin["channel"]]: [number, number][];
  }>({});
  const [maxX, setMaxX] = useState(
    Math.max(
      ...(orders.length
        ? orders.map((o) => o.duration + o.offset)
        : [30 * 60 * 1000])
    )
  );
  const [step, setStep] = useState(
    Math.min(
      1000,
      Number(
        [...steps].reverse().find(({ value }) => Number(value) <= maxX / 4)
          ?.value
      ) || 10
    )
  );
  const [sequenceLength, setSequenceLength] = useState<
    { value: string; label: string }[]
  >([...defaultSequenceLength]);
  const [customLength, setCustomLength] = useState(false);

  // Sort orders by channel
  useEffect(() => {
    const map: { [key: Pin["channel"]]: [number, number][] } = {};
    orders.forEach((o) => {
      if (map[o.channel]) {
        map[o.channel] = map[o.channel]
          .concat([[o.offset / maxX, (o.offset + o.duration) / maxX]])
          .sort(sortOrder);
      } else {
        map[o.channel] = [[o.offset / maxX, (o.offset + o.duration) / maxX]];
      }
    });
    setChannelMap(map);
  }, [orders]);

  // Update SequenceLength with Custom lengths
  useEffect(() => {
    if (!sequenceLength.some(({ value }) => value === String(maxX))) {
      setSequenceLength([
        ...defaultSequenceLength,
        {
          value: String(maxX),
          label: `${t("custom")} - ${formatTimeLabel(maxX, {
            min: t("minute"),
            sec: t("second"),
            h: t("hour"),
            ms: t("ms"),
          })}`,
        },
      ]);
    } else setSequenceLength([...defaultSequenceLength]);
  }, [maxX]);

  return (
    <div>
      <Group p="xs">
        <Group>
          <Select
            styles={{ root: { width: "50%" } }}
            label={t("sequence_length")}
            value={String(maxX)}
            data={sequenceLength}
            onChange={(v) => {
              const length = Number(v);
              setMaxX(length);
              // Make sure step is at most quarter of the length
              const newStep =
                length / 2 < step
                  ? Number(
                      [...steps]
                        .reverse()
                        .find(({ value }) => Number(value) <= length / 4)
                        ?.value || 10
                    )
                  : undefined;
              newStep && setStep(newStep);
              onChange(update(channelMap, length));
            }}
            rightSection={
              <ActionIcon
                size={"sm"}
                color="gray"
                onClick={() => setCustomLength(true)}
              >
                <Plus />
              </ActionIcon>
            }
          />
          <Select
            styles={{ root: { width: "40%" } }}
            label={t("step")}
            value={String(step)}
            data={steps}
            onChange={(v) => {
              const c = Number(v);
              if (isNaN(c) || maxX * 0.25 < c) return;
              setStep(c);
            }}
          />
        </Group>
        <Select
          styles={{ root: { minWidth: "25%" } }}
          label={t("channels")}
          value=""
          data={
            pins
              .filter((p) => !channelMap[p.channel])
              .map((p) => ({ value: String(p.channel), label: p.label })) || []
          }
          placeholder={`${t("add_channel")}`}
          onChange={(v) => {
            const c = Number(v);
            if (isNaN(c)) return;
            setChannelMap((old) => ({ ...old, [c]: [[0, 0.1]] }));
          }}
          error={error}
        />
      </Group>
      {[...Object.keys(channelMap)].map((channel) => (
        <TrackInput
          key={channel}
          value={channelMap[Number(channel)]}
          onChange={(vs) => {
            setChannelMap((old) => ({ ...old, [Number(channel)]: vs }));
          }}
          onChangeEnd={(vs) => {
            setChannelMap({ ...channelMap, [Number(channel)]: vs });
            onChange(update({ ...channelMap, [Number(channel)]: vs }, maxX));
          }}
          label={
            pins.find(({ channel: c }) => c === Number(channel))?.label || ""
          }
          description={`${t("channel")}: ${channel}`}
          formatTooltip={(v) => formatDuration(round(v * maxX), timeLabel)}
          step={step / maxX}
        />
      ))}
      <DurationInput
        opened={customLength}
        onClose={() => setCustomLength(false)}
        onSubmit={(ms) => {
          setMaxX(ms);
          onChange(update(channelMap, ms));
          setCustomLength(false);
        }}
      />
    </div>
  );
};

export default OrdersInput;
