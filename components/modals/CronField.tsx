import {
  Group,
  MultiSelect,
  RangeSlider,
  Select,
  Chip,
  Chips,
} from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface CronInputProps {
  min: number;
  max: number;
  formatLabel?: (n: number) => string;
  initialValue: string;
  onChange: (s: string) => void;
}

type CronType = "*" | "range" | "step" | "collection";

const types: { value: CronType; label: string }[] = [
  { value: "*", label: "all" },
  { value: "range", label: "range" },
  { value: "step", label: "step" },
  { value: "collection", label: "choices" },
];

const getRange = (
  start: number,
  finish: number,
  formatLabel: (n: number) => string = String
): { value: string; label: string }[] =>
  [...Array(finish - start + 1)].map((_, i) => ({
    value: String(i + start),
    label: formatLabel(i + start),
  }));

const getTypeFromCron = (cron: string) => {
  if (cron === "*") return "*";
  if (cron.split("/").length === 2) return "step";
  if (cron.split("-").length === 2) return "range";
  return "collection";
};
const getRangeFromCron = (cron: string): [number, number] | undefined => {
  const r = cron.split("-").map(Number);
  if (r.length === 2) return [r[0], r[1]];
};
const getStepFromCron = (
  cron: string
): { start: number; step: number } | undefined => {
  const s = cron.split("/").map(Number);
  if (s.length === 2) return { start: s[0], step: s[1] };
};
const getCollectionFromCron = (cron: string): number[] | undefined => {
  const col = cron.split(",").map(Number);
  if (!isNaN(col.reduce((acc, val) => acc + val, 0))) return [...col];
};

const CronField: FC<CronInputProps> = ({
  min,
  max,
  formatLabel = String,
  initialValue,
  onChange,
}) => {
  const [type, setType] = useState(getTypeFromCron(initialValue));
  const [range, setRange] = useState<[number, number]>(
    getRangeFromCron(initialValue) || [min, max]
  );
  const [step, setStep] = useState<{ start: number; step: number }>(
    getStepFromCron(initialValue) || { start: min, step: 1 }
  );
  const [collection, setCollection] = useState<number[]>(
    getCollectionFromCron(initialValue) || [min]
  );

  const { t } = useTranslation();

  useEffect(() => {
    let str = "";
    switch (type) {
      case "*":
        str = "*";
        break;
      case "range":
        str = range.join("-");
        break;
      case "step":
        str = step.start + "/" + step.step;
        break;
      case "collection":
        str = collection.join(",");
        break;
    }
    onChange(str);
  }, [type, range, step, collection]);

  return (
    <Group py="sm" direction="column" align={"stretch"}>
      <Chips multiple={false} value={type} onChange={setType}>
        {types.map(({ value, label }) => (
          <Chip key={value} value={value}>
            {t(label)}
          </Chip>
        ))}
      </Chips>
      {type === "range" ? (
        <RangeSlider
          py="sm"
          px="xl"
          value={range}
          onChange={setRange}
          min={min}
          max={max}
          minRange={1}
          step={1}
          label={formatLabel}
        />
      ) : type === "step" ? (
        <Group py="sm" pt="0">
          <Select
            style={{ width: "10rem" }}
            label={t("start")}
            data={getRange(min, max, formatLabel)}
            value={String(step.start)}
            onChange={(v) => setStep((s) => ({ ...s, start: Number(v) }))}
          />
          <Select
            label={t("step")}
            style={{ width: "10rem" }}
            data={getRange(min, max, String)}
            value={String(step.step)}
            onChange={(v) => setStep((s) => ({ ...s, step: Number(v) }))}
          />
        </Group>
      ) : type === "collection" ? (
        <MultiSelect
          value={collection.map(String)}
          onChange={(vs) => vs.length && setCollection(vs.map(Number))}
          py="sm"
          data={getRange(min, max, formatLabel)}
        />
      ) : null}
    </Group>
  );
};

export default CronField;
