import express from "express";
import cors from "cors";
import ScrapeRoute from "./src/routes/ScrapeRoute"
const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json());
app.use("/api", ScrapeRoute); 

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
