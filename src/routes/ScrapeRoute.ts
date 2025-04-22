import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";

const router = express.Router();

router.get("/scrape", async (req, res) => {
  const keyword = req.query.keyword as string;
  if (!keyword) {
    return res.status(400).json({ error: "Keyword é obrigatória" });
  }

  try {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const products = [];

    document.querySelectorAll("div.s-result-item").forEach((item) => {
      const title = item.querySelector("h2 a span")?.textContent?.trim() || "";
      const rating =
        item.querySelector("i span")?.textContent?.trim().split(" ")[0] || "";
      const reviews =
        item.querySelector(".s-link-style .s-underline-text")?.textContent?.trim() || "";
      const image =
        item.querySelector("img.s-image")?.getAttribute("src") || "";

      if (title) {
        products.push({ title, rating, reviews, image });
      }
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar dados da Amazon" });
  }
});

export default router;
