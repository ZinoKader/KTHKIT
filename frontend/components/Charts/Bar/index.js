import { ResponsiveBar } from "@nivo/bar";

const percentageFormat = v => `${v}%`;

const Bar = ({ data, percentize = true, compact = false }) => (
  <ResponsiveBar
    data={data}
    keys={["F", "Fx", "E", "D", "C", "B", "A"]}
    indexBy="group_key"
    padding={compact ? 0.6 : 0.28}
    borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
    animate={true}
    motionStiffness={250}
    motionDamping={30}
    labelFormat={compact ? () => "" : percentize ? percentageFormat : v => v}
    tooltipFormat={percentize ? percentageFormat : v => v}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{ from: "color", modifiers: [["darker", 5]] }}
    axisTop={null}
    axisRight={null}
    margin={{
      top: 5,
      right: compact ? 0 : 70,
      bottom: 50,
      left: compact ? 0 : 60
    }}
    colors={[
      "hsl(359, 61%, 45%)",
      "hsl(1, 100%, 59%)",
      "hsl(54, 100%, 62%)",
      "hsl(63, 80%, 60%)",
      "hsl(66, 100%, 42%)",
      "hsl(122, 40%, 58%)",
      "hsl(122, 39%, 49%)"
    ]}
    tooltip={({ id, value, indexValue, data }) => (
      <strong>
        {data.full_name} ({indexValue})
        <br />
        {id}: {percentize ? percentageFormat(value) : value}
      </strong>
    )}
    axisBottom={{
      tickSize: 6,
      tickPadding: compact ? 0 : 5,
      tickRotation: 0,
      legend: compact
        ? `Y-axel: ${percentize ? "Procent" : "Antal"} | X-axel: Program/Grupp`
        : "Program/Grupp",
      legendPosition: "middle",
      legendOffset: compact ? 35 : 40
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: compact ? 0 : 5,
      tickRotation: 0,
      legend: compact ? "" : percentize ? "Procent" : "Antal",
      legendPosition: "middle",
      legendOffset: compact ? -35 : -50
    }}
    legends={
      compact
        ? []
        : [
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: true,
              translateX: 55,
              translateY: 0,
              itemsSpacing: 2.5,
              itemWidth: 40,
              itemHeight: 25,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 15,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]
    }
    defs={[
      {
        id: "AStyle",
        type: "linearGradient",
        colors: [
          { offset: 0, color: "hsl(122, 39%, 49%)" },
          { offset: 100, color: "hsl(122, 39%, 49%)" }
        ]
      },
      {
        id: "BStyle",
        type: "linearGradient",
        colors: [
          { offset: 0, color: "hsl(122, 40%, 58%)" },
          { offset: 100, color: "hsl(122, 40%, 58%)" }
        ]
      },
      {
        id: "CStyle",
        type: "linearGradient",
        colors: [
          { offset: 0, color: "hsl(66, 100%, 42%)" },
          { offset: 100, color: "hsl(66, 100%, 42%)" }
        ]
      },
      {
        id: "DStyle",
        type: "linearGradient",
        colors: [
          { offset: 0, color: "hsl(63, 80%, 60%)" },
          { offset: 100, color: "hsl(63, 80%, 60%)" }
        ]
      },
      {
        id: "EStyle",
        type: "linearGradient",
        colors: [
          { offset: 0, color: "hsl(54, 100%, 62%)" },
          { offset: 100, color: "hsl(54, 100%, 62%)" }
        ]
      },
      {
        id: "FxStyle",
        type: "linearGradient",
        colors: [
          { offset: 0, color: "hsl(1, 100%, 59%)" },
          { offset: 100, color: "hsl(1, 100%, 59%)" }
        ]
      },
      {
        id: "FStyle",
        type: "linearGradient",
        colors: [
          { offset: 0, color: "hsl(359, 61%, 45%)" },
          { offset: 100, color: "hsl(359, 61%, 45%)" }
        ]
      }
    ]}
    fill={[
      {
        match: {
          id: "A"
        },
        id: "AStyle"
      },
      {
        match: {
          id: "B"
        },
        id: "BStyle"
      },
      {
        match: {
          id: "C"
        },
        id: "CStyle"
      },
      {
        match: {
          id: "D"
        },
        id: "DStyle"
      },
      {
        match: {
          id: "E"
        },
        id: "EStyle"
      },
      {
        match: {
          id: "Fx"
        },
        id: "FxStyle"
      },
      {
        match: {
          id: "F"
        },
        id: "FStyle"
      }
    ]}
  />
);

export default Bar;
