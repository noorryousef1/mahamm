import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(fs.readFileSync(path.join(here, "..", "..", "db.seed.json"), "utf-8"));
const outDir = path.join(here, "..", "dist", "data");

const data = {
  events: seed.events,
  members: seed.members,
  tasks: seed.tasks,
  feedback: seed.feedback.filter((f) => f.status === "approved"),
  bookings: [],
};

fs.mkdirSync(outDir, { recursive: true });
for (const [name, value] of Object.entries(data)) {
  fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(value));
}

console.log("static data written:", Object.keys(data).join(", "));
