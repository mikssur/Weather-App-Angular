// combining two arrays of dates and temperatures into array of objects with these values
function combineArrays(
  data: number[],
  time: string[]
): { value: number; timestamp: string }[] {
  const combined: { value: number; timestamp: string }[] = [];
  for (let i = 0; i < data.length; i++) {
    combined.push({ value: data[i], timestamp: time[i] });
  }
  return combined;
}

// creating array of objects with average temperature per date
export function calculateAverage(
  data: number[],
  time: string[]
): { date: string; averageTemperature: number }[] {
  const combined: { value: number; timestamp: string }[] = combineArrays(
    data,
    time
  );

  const reduced: { date: string; averageTemperature: number }[] = [];
  const dateMap: Map<string, { sum: number; count: number }> = new Map();

  for (const item of combined) {
    const date = item.timestamp.split('T')[0];

    if (dateMap.has(date)) {
      const entry: any = dateMap.get(date);

      entry.sum += item.value;
      entry.count += 1;
    } else {
      dateMap.set(date, { sum: item.value, count: 1 });
    }
  }

  for (const [date, { sum, count }] of dateMap.entries()) {
    const averageTemperature = Math.ceil(sum / count);

    reduced.push({ date, averageTemperature });
  }

  return reduced;
}
