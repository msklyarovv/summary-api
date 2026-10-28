export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const groupKey = String(item[key]);
    if (acc[groupKey]) {
      acc[groupKey].push(item);
    } else {
      acc[groupKey] = [item];
    }
    return acc;
  }, {});
}
