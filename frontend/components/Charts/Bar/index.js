import { ResponsiveBar } from "@nivo/bar";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const Bar = ({ data }) => (
  <ResponsiveBar
    data={data}
    keys={["Fx", "F", "E", "D", "C", "B", "A"]}
    colors={{ scheme: "yellow_green" }}
    indexBy="group_key"
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    padding={0.3}
    borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Program/Grupp",
      legendPosition: "middle",
      legendOffset: 32
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Betyg",
      legendPosition: "middle",
      legendOffset: -40
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
    legends={[
      {
        dataFrom: "keys",
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 1,
        itemWidth: 80,
        itemHeight: 16,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1
            }
          }
        ]
      }
    ]}
    defs={[
      {
        id: "AStyle",
        type: "patternLines",
        color: "hsl(122, 39%, 49%)",
        background: "hsl(122, 39%, 49%)"
      },
      {
        id: "BStyle",
        type: "patternLines",
        color: "hsl(122, 40%, 58%)",
        background: "hsl(122, 40%, 58%)"
      },
      {
        id: "CStyle",
        type: "patternLines",
        color: "hsl(66, 100%, 42%)",
        background: "hsl(66, 100%, 42%)"
      },
      {
        id: "DStyle",
        type: "patternLines",
        color: "hsl(63, 80%, 60%)",
        background: "hsl(63, 80%, 60%)"
      },
      {
        id: "EStyle",
        type: "patternLines",
        color: "hsl(54, 100%, 62%)",
        background: "hsl(54, 100%, 62%)"
      },
      {
        id: "FStyle",
        type: "patternLines",
        color: "hsl(1, 100%, 59%)",
        background: "hsl(1, 100%, 59%)"
      },
      {
        id: "FxStyle",
        type: "patternLines",
        color: "hsl(359, 61%, 40%)",
        background: "hsl(359, 61%, 40%)"
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
          id: "F"
        },
        id: "FStyle"
      },
      {
        match: {
          id: "Fx"
        },
        id: "FxStyle"
      }
    ]}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
  />
);

export default Bar;
