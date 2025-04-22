import axios from "axios";
import { JSDOM } from "jsdom";
import type { Product } from "../core/entities/Product";

export async function scrapeAmazon(keyword: string): Promise<Product[]>{
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    const {data: html} = await axios.get(url,{
        headers:{
            "User-Agent": "Mozilla/5.0",
        },
    });
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const items = document.querySelectorAll('[data-component-type="s-search-result"]');

    const products: Product[] = [];

    items.forEach((item) => {
        const title = item.querySelector("h2 span")?.textContent?.trim() || "Sem título";
        const rating = parseFloat(item.querySelector(".a-icon.alt")?.textContent?.split(" ")[0] || "0");
        const ratingCount = parseInt(item.querySelector(".a-size-base.s-underline-text")?.textContent?.replace(",", "") || "0");
        const imageUrl = item.querySelector("img.s-image")?.getAttribute("src") || "";
        products.push({ title, rating, ratingCount, imageUrl });
    });
    return products;
}
