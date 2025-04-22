import type { Request, Response } from "express";
import { scrapeAmazon } from "../services/ScrapeAmazonService";

export async function scrapeController(req: Request, res: Response){
    const {keyword} = req.query; 

    if(!keyword || typeof keyword !== "string"){
        return res.status(400).json({error: "Keywird is required"});
    }

    try{
        const products = await scrapeAmazon(keyword);
        return res.json(products);
    }catch(err){
        return res.status(500).json({ error: "Error processing request." });
    }
}