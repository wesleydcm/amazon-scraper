const express = require("express");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const path = require('path')

const app = express();
const PORT = 3000;

// Define o diretório estático para servir arquivos HTML, CSS e JS
app.use(express.static(path.join(__dirname, 'public')));

app.get("/api/scrape", async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required" });
    }

    const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
    const response = await axios.get(url);
    const { document } = new JSDOM(response.data).window;

    const products = Array.from(document.querySelectorAll(".s-result-item"));
    const scrapedData = products.map((product) => {
      const title = product.querySelector("h2 span").textContent;
      const rating = parseFloat(
        product
          .querySelector(".a-icon-star-small .a-icon-alt")
          .textContent.split(" ")[0]
      );
      const reviews = parseInt(
        product
          .querySelector(".a-size-small .a-size-base")
          .textContent.replace(/[^\d]/g, "")
      );
      const image = product.querySelector(".s-image").getAttribute("src");

      return { title, rating, reviews, image };
    });

    res.json({ data: scrapedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
