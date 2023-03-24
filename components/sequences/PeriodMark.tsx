import { useMantineTheme } from "@mantine/core";
import { ScaleBand, ScaleLinear } from "d3-scale";

interface PeriodMarkProps<T> {
  item: T;
  xScale: ScaleLinear<number, number>;
  x1Value: (item: T) => number;
  x2Value: (item: T) => number;
  yScale: ScaleBand<number>;
  yValue: (item: T) => number;
  showThump?: boolean;
}

function PeriodMark<T extends Object>({
  item,
  x1Value,
  x2Value,
  xScale,
  yValue,
  yScale,
  showThump,
}: PeriodMarkProps<T>) {
  const theme = useMantineTheme();

  const x1 = xScale(x1Value(item));
  const x2 = xScale(x2Value(item));
  const width = Math.abs(x2 - x1);
  const height = yScale.bandwidth();
  const y = yScale(yValue(item));
  return (
    <g>
      <rect
        width={`${width}%`}
        height={height}
        x={`${Math.min(x1, x2)}%`}
        y={y}
        fill={theme.colors.blue[7]}
        rx={yScale.bandwidth() / 2}
      />
      {showThump && (
        <>
          <circle
            r={yScale.bandwidth()}
            stroke={theme.colors.blue[7]}
            cx={`${x1}%`}
            cy={(y || 0) + yScale.bandwidth() / 2}
            fill={"white"}
            strokeWidth={3}
          />
          <circle
            r={yScale.bandwidth()}
            stroke={theme.colors.blue[7]}
            cx={`${x2}%`}
            cy={(y || 0) + yScale.bandwidth() / 2}
            fill={"white"}
            strokeWidth={3}
          />
        </>
      )}
    </g>
  );
}

export default PeriodMark;
