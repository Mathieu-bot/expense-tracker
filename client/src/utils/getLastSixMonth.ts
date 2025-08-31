export default function getLastSixMonths() {
  const results: { start: string; end: string }[] = [];
  const today = new Date();

  for (let i = 0; i < 6; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);

    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    results.push({
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
    });
  }

  return results;
}
