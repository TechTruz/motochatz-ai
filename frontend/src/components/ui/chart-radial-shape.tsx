"use client";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

export const description = "A radial chart with a custom shape";

interface ChartRadialShapeProps {
  title: string;
  description: string;
  value: number;
  label: string;
  endAngle?: number;
  trendText?: string;
  footerText?: string;
  colorKey?: string;
  dataKey?: string;
}

export function ChartRadialShape({
  title,
  description,
  value,
  label,
  endAngle = 100,
  trendText = "Trending up by 5.2% this month",
  footerText = "Showing data for the last month",
  colorKey = "safari",
  dataKey = "value",
}: ChartRadialShapeProps) {
  const chartData = [{ [dataKey]: value, fill: `var(--color-${colorKey})` }];

  const chartConfig = {
    [dataKey]: {
      label,
    },
    [colorKey]: {
      label,
      color: `var(--chart-${colorKey === "safari" ? "2" : colorKey === "queries" ? "1" : colorKey === "accuracy" ? "2" : "3"})`,
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <RadialBarChart
            data={chartData}
            endAngle={endAngle}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey={dataKey} background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {value.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {label}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {trendText} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">{footerText}</div>
      </CardFooter>
    </Card>
  );
}
