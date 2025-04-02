import { startOfISOWeek, endOfISOWeek } from "date-fns";

export enum AggregationType {
  Sum = "sum",
  Mean = "mean",
  Median = "median",
}
export enum AggregationTimeWindow {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
}

export type AggregatedResult = {
  period: string;
  value: number;
  count: number;
};

interface GroupItem {
  value: number;
  date: Date;
}

interface GroupedData {
  [period: string]: GroupItem[];
}

export function aggregateData(
  rows: Record<string, string>[],
  dateField: string,
  valueField: string,
  aggType: AggregationType,
  window: AggregationTimeWindow
): AggregatedResult[] {
  const typedData = rows.map((row) => ({
    date: parseDate(row[dateField]),
    value: parseFloat(row[valueField]) || 0,
  }));

  const grouped: GroupedData = typedData.reduce((acc, item) => {
    const date = item.date;
    if (!date) return acc;

    let period: string;
    switch (window) {
      case AggregationTimeWindow.Daily:
        period = date.toISOString().split("T")[0]; // YYYY-MM-DD
        break;
      case AggregationTimeWindow.Weekly:
        const weekStart = startOfISOWeek(date);
        const weekEnd = endOfISOWeek(date);
        period = `${weekStart.toISOString().split("T")[0]}_${
          weekEnd.toISOString().split("T")[0]
        }`;

        break;
      case AggregationTimeWindow.Monthly:
        period = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        break;
      default:
        return acc;
    }

    if (!acc[period]) {
      acc[period] = [];
    }
    acc[period].push({ ...item, date });

    return acc;
  }, {} as GroupedData);
  console.log("GroupedData:", grouped, window);

  // Calculate aggregations
  return Object.entries(grouped).reduce((acc, [period, group]) => {
    if (period === "invalid") return acc; // Skip invalid entries
    acc.push({
      period,
      value: calculateAggregation(
        group.map((i: GroupItem) => i.value),
        aggType
      ),
      count: group.length,
    });

    return acc;
  }, [] as AggregatedResult[]);
}

// Helper functions
function parseDate(dateString: string): Date | null {
  try {
    return new Date(dateString);
  } catch {
    return null;
  }
}
function calculateAggregation(values: number[], type: AggregationType): number {
  const validValues = values.filter((v) => !isNaN(v));
  if (validValues.length === 0) return 0;

  switch (type) {
    case AggregationType.Sum:
      return validValues.reduce((a, b) => a + b, 0);
    case AggregationType.Mean:
      return validValues.reduce((a, b) => a + b, 0) / validValues.length;
    case AggregationType.Median:
      const sorted = [...validValues].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
    default:
      return 0;
  }
}
