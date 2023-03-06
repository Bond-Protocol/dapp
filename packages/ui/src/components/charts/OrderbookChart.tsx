import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { ask: 10, bid: 22, volume: 100000 },
  { ask: 11, bid: 19, volume: 60000 },
  { ask: 12, bid: 17, volume: 50000 },
  { ask: 13, bid: 5, volume: 20000 },
  { ask: 14, bid: 1, volume: 5000 },
];

export const OrderbookChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="volume" type="number" />
        <YAxis dataKey="bid" yAxisId="left" domain={[0, 22]} hide />
        <YAxis dataKey="ask" yAxisId="right" domain={[0, 22]} />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="right"
          type="step"
          dataKey="bid"
          dot={false}
          stroke="#FF0606"
        />
        <Line
          yAxisId="left"
          type="step"
          dataKey="ask"
          dot={false}
          stroke="#88F6D7"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
