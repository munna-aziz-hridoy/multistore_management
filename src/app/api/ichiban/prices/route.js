import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

// Force this route to be dynamic (not prerendered)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const product_ids = [
  32,
  31,
  30,
  33,
  29,
  27,
  28,
  25,
  26,
  23,
  22,
  20,
  21,
  19,
  "03",
];

export async function GET(request) {
  try {
    let products = [];

    for (const id of product_ids) {
      const category = `https://www.mobile-ichiban.com/Prod/1/01/${id}`;

      const response = await fetch(category, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
        },
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch data for product ID ${id}: ${response.status}`
        );
        continue; // Skip this product and continue with others
      }

      const htmlRawText = await response.text();

      const document = new JSDOM(htmlRawText).window.document;

      const productList = document.querySelectorAll(
        ".col-6.col-md-4.col-lg-3.mb-1"
      );

      Array.from(productList).forEach((productNode) => {
        try {
          const nameElement = productNode.querySelector(
            "label.hideText.mb-0.px-2.w-100"
          );
          const priceElement = productNode.querySelector(
            "label.mb-0.text-right"
          );
          const imageElement = productNode.querySelector("img.card-img-top");

          if (!nameElement || !priceElement || !imageElement) {
            return; // Skip this product if elements are missing
          }

          const name = nameElement.textContent.trim().replace(/\s+/g, " ");
          const price = priceElement.textContent.trim();
          const image = imageElement.attributes["src"].value;
          const id = image.split("/").pop().split(".")[0].split("_")[0];

          products.push({
            id,
            name: name,
            price: price,
            image: `https://www.mobile-ichiban.com/${image}`,
          });
        } catch (error) {
          console.error("Error parsing product node:", error);
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Handle file operations with proper error handling
    let prev_data = [];
    const filePath = path.join(
      process.cwd(),
      "public",
      "ichiban-products.json"
    );

    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        prev_data = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error("Error reading previous data:", error);
      prev_data = []; // Continue with empty array if file read fails
    }

    // Create a map of previous products by id for quick lookup
    const prevProductMap = new Map();
    prev_data.forEach((product) => {
      prevProductMap.set(product.id, product.price);
    });

    // Compare current products with previous data and mark changes
    const productsWithChanges = products.map((currentProduct) => {
      const prevPrice = prevProductMap.get(currentProduct.id);

      // Check if price has changed
      const hasChanged = prevPrice && prevPrice !== currentProduct.price;

      return {
        ...currentProduct,
        changed: hasChanged ? true : false,
        ...(hasChanged && { prevPrice: prevPrice }),
      };
    });

    // Save current data as new previous data for next comparison
    try {
      // Ensure the public directory exists
      const publicDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error("Error saving data:", error);
      // Continue without saving if write fails
    }

    return Response.json({
      status: "success",
      products: productsWithChanges,
      totalProducts: products.length,
      changedProducts: productsWithChanges.filter((p) => p.changed).length,
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      {
        status: "error",
        error: "Failed to fetch iPhone prices",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
