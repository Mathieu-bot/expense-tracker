const net = require("net");
const s = net.createConnection(5432, "db.fhamrxpgdjpqhrppkzka.supabase.co");
s.setTimeout(4000);
s.on("connect", () => {
  console.log("TCP ok");
  process.exit(0);
});
s.on("timeout", () => {
  console.error("TCP timeout");
  process.exit(1);
});
s.on("error", (e) => {
  console.error("TCP error:", e.code || e.message);
  process.exit(1);
});
