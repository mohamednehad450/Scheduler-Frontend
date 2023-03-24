import { FC } from "react";
import { Pin, Sequence } from "../common";
import {
  Container,
  Divider,
  Group,
  MediaQuery,
  ScrollArea,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { scaleBand, scaleLinear } from "d3-scale";
import PeriodMark from "./PeriodMark";
import PeriodTrack from "./PeriodTrack";
import PeriodTicks from "./PeriodTicks";
import { useTranslation } from "react-i18next";

interface OrdersPreviewProps {
  orders: Sequence["orders"];
  pins?: Pin[];
}

const OrdersPreview: FC<OrdersPreviewProps> = ({ orders, pins }) => {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const marksWidthPercentage = 80;
  const rowHeight = 24;

  const maxX = Math.max(...orders.map((o) => o.offset + o.duration));
  const xScale = scaleLinear()
    .domain([0, maxX])
    .range(theme.dir === "rtl" ? [100, 0] : [0, 100]);

  const channels = new Map<number, string>();

  orders.forEach(
    (o) =>
      !channels.has(o.channel) &&
      channels.set(
        o.channel,
        pins?.find((p) => p.channel === o.channel)?.label || ""
      )
  );

  const maxY = channels.size * rowHeight;
  const yScale = scaleBand<number>()
    .domain([...channels.keys()])
    .range([0, maxY])
    .paddingInner(0.65)
    .paddingOuter(0.25);

  const x1 = <T extends { offset: number }>(o: T) => o.offset;
  const x2 = <T extends { duration: number; offset: number }>(o: T) =>
    o.duration + o.offset;
  const channel = <T extends { channel: number }>(o: T) => o.channel;

  return (
    <Container
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Group pt="xs">
        <Text size="xl">{t("orders_previews")}</Text>
      </Group>
      <Divider />
      <ScrollArea pt="xs" styles={{ root: { flex: 1 } }}>
        <svg
          width={`97%`}
          style={{ overflow: "visible" }}
          height={maxY + yScale.bandwidth()}
        >
          <MediaQuery
            smallerThan={"xs"}
            styles={{ fontSize: theme.fontSizes.xs }}
          >
            <g>
              {[...channels.entries()].map(([c, label]) => (
                <foreignObject
                  key={c}
                  width={100 - marksWidthPercentage + "%"}
                  height={rowHeight}
                  x={theme.dir === "rtl" ? marksWidthPercentage + "%" : 0}
                  y={(yScale(c) || 0) - yScale.bandwidth()}
                  style={{ whiteSpace: "nowrap", overflow: "hidden" }}
                >
                  <Text
                    style={{
                      lineHeight: rowHeight + "px",
                      fontSize: "inherit",
                      overflow: "clip",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {label}
                  </Text>
                </foreignObject>
              ))}
            </g>
          </MediaQuery>
          <svg
            x={(theme.dir === "ltr" ? 100 - marksWidthPercentage : 0) + "%"}
            width={marksWidthPercentage + "%"}
            style={{ overflow: "visible" }}
          >
            {[...channels.keys()].map((c) => (
              <PeriodTrack yScale={yScale} xScale={xScale} yValue={c} key={c} />
            ))}

            {orders.map((order) => (
              <PeriodMark
                item={order}
                x1Value={x1}
                x2Value={x2}
                yValue={channel}
                xScale={xScale}
                yScale={yScale}
                key={`${order.channel}:${order.offset}-${order.duration}`}
              />
            ))}
            <PeriodTicks {...{ xScale, yScale }} />
          </svg>
        </svg>
      </ScrollArea>
    </Container>
  );
};

export default OrdersPreview;
