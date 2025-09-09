const pad = (n: number) => String(n).padStart(2, "0");

function monthBounds(date = new Date()) {
  const y = date.getFullYear();
  const m = date.getMonth();

  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  return { start: fmt(start), end: fmt(end) };
}

export default monthBounds;
