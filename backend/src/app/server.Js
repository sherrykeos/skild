import "dotenv/config";
import app from "./app.js";
import { bootstrapRoles } from "../utils/bootstrapRoles.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await bootstrapRoles();
});
