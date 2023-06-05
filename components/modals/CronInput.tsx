import { Tabs } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatHour, getDayName, getMonthName } from "../common";
import CronField from "./CronField";

const parseCron = (c: string) => {
  const arr = c.split(" ");
  if (arr.length === 5) {
    return {
      sec: "0",
      min: arr[0],
      hour: arr[1],
      dom: arr[2],
      month: arr[3],
      dow: arr[4],
    };
  }
  if (arr.length === 6) {
    return {
      sec: arr[0],
      min: arr[1],
      hour: arr[2],
      dom: arr[3],
      month: arr[4],
      dow: arr[5],
    };
  } else {
    return {
      sec: "*",
      min: "*",
      hour: "*",
      dom: "*",
      month: "*",
      dow: "*",
    };
  }
};

const CronInput: FC<{ initCron: string; onChange: (cron: string) => void }> = ({
  initCron,
  onChange,
}) => {
  const { sec, min, hour, dom, month, dow } = parseCron(initCron || "");

  const { t } = useTranslation();

  const [secCron, setSecCron] = useState(sec);
  const [minCron, setMinCron] = useState(min);
  const [hourCron, setHourCron] = useState(hour);
  const [domCron, setDomCron] = useState(dom);
  const [monthCron, setMonthCron] = useState(month);
  const [dowCron, setDowCron] = useState(dow);

  useEffect(() => {
    onChange(
      [secCron, minCron, hourCron, domCron, monthCron, dowCron].join(" ")
    );
  }, [secCron, minCron, hourCron, domCron, monthCron, dowCron]);

  return (
    <Tabs py="sm" defaultValue={"second"}>
      <Tabs.List>
        <Tabs.Tab value="second">{t("second")}</Tabs.Tab>
        <Tabs.Tab value="minute">{t("minute")}</Tabs.Tab>
        <Tabs.Tab value="hour">{t("hour")}</Tabs.Tab>
        <Tabs.Tab value="day_of_month">{t("day_of_month")}</Tabs.Tab>
        <Tabs.Tab value="month">{t("month")}</Tabs.Tab>
        <Tabs.Tab value="day_of_week">{t("day_of_week")}</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="second">
        <CronField
          min={0}
          max={59}
          initialValue={secCron}
          onChange={(s) => setSecCron(s)}
        />
      </Tabs.Panel>
      <Tabs.Panel value="minute">
        <CronField
          min={0}
          max={59}
          initialValue={minCron}
          onChange={(s) => setMinCron(s)}
        />
      </Tabs.Panel>
      <Tabs.Panel value="hour">
        <CronField
          min={0}
          max={23}
          formatLabel={formatHour}
          initialValue={hourCron}
          onChange={(s) => setHourCron(s)}
        />
      </Tabs.Panel>
      <Tabs.Panel value="day_of_month">
        <CronField
          min={1}
          max={31}
          initialValue={domCron}
          onChange={(s) => setDomCron(s)}
        />
      </Tabs.Panel>
      <Tabs.Panel value="month">
        <CronField
          min={0}
          max={11}
          formatLabel={(n) => t(getMonthName(n))}
          initialValue={monthCron}
          onChange={(s) => setMonthCron(s)}
        />
      </Tabs.Panel>
      <Tabs.Panel value="day_of_week">
        <CronField
          min={0}
          max={6}
          formatLabel={(n) => t(getDayName(n))}
          initialValue={dowCron}
          onChange={(s) => setDowCron(s)}
        />
      </Tabs.Panel>
    </Tabs>
  );
};

export default CronInput;
