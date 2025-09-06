export default function getLastSixMonths(): string[] {
  const now = new Date();
  const results: string[] = [];

  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    results.push(start);
  }

  return results.reverse();
}
