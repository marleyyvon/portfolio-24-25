"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Legend } from "recharts";

const chartData = [
  { month: "July", student: 0, faculty: 0 },
  { month: "August", student: 0, faculty: 0 },
  { month: "September", student: 1, faculty: 0 },
  { month: "October", student: 5, faculty: 2 },
  { month: "November", student: 7, faculty: 3 },
  { month: "December", student: 4, faculty: 2 },
];

const Chart = () => {
  return (
    <div className="min-h-[200px] w-full">
      <h2 className="text-left text-xl font-bold mb-4">New Projects</h2>
      <BarChart width={800} height={300} data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Tooltip formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()]} />
        <Legend formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()} />
        <Bar dataKey="student" fill="#72d6e5" radius={4} />
        <Bar dataKey="faculty" fill="#1B9CE5" radius={4} />
      </BarChart>
    </div>
  );
};

export default Chart;
