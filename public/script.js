document.addEventListener("DOMContentLoaded", () => {
  const scrapeButton = document.getElementById("scrapeButton");
  const keywordInput = document.getElementById("keywordInput");
  const resultsContainer = document.getElementById("results");

  scrapeButton.addEventListener("click", async () => {
    const keyword = keywordInput.value.trim();
    if (!keyword) {
      alert("Please enter a keyword");
      return;
    }

    try {
      const response = await fetch(
        `/api/scrape?keyword=${encodeURIComponent(keyword)}`
      );
      const data = await response.json();

      resultsContainer.innerHTML = "";

      data.data.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
          <h2>${product.title}</h2>
          <p>Rating: ${product.rating}</p>
          <p>Reviews: ${product.reviews}</p>
          <img src="${product.image}" alt="${product.title}">
        `;
        resultsContainer.appendChild(productElement);
      });
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching data");
    }
  });
});
