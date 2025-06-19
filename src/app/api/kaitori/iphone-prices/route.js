import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const price_map = {
  "0px": "7",
  "-10px": "5",
  "-20px": "9",
  "-30px": "3",
  "-40px": "6",
  "-50px": "1",
  "-60px": "4",
  "-70px": "0",
  "-80px": "2",
  "-90px": "8",
  "-100px": ",",
};

// Force this route to be dynamic (not prerendered)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Define all the category IDs you want to scrape
const category_ids = [
  690, 689, 688, 687, 697, 670, 669, 668, 667, 612, 611, 610, 609, 580, 522,
  521, 520, 519, 367, 378, 376, 377, 243, 242, 241, 240, 239, 238,
];

export async function GET(request) {
  try {
    let products = [];

    for (const cat_id of category_ids) {
      const category = `https://www.kaitorishouten-co.jp/category/1/${cat_id}`;

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
          `Failed to fetch data for category ID ${cat_id}: ${response.status}`
        );
        continue; // Skip this category and continue with others
      }

      const htmlRawText = await response.text();

      const document = new JSDOM(htmlRawText).window.document;

      const productList = document.querySelectorAll("tbody tr");

      Array.from(productList).forEach((productNode) => {
        try {
          const name = productNode.querySelector("td:nth-child(2)");
          const price_nodes = productNode.querySelector("td:nth-child(4)");
          const image = productNode.querySelector("td:nth-child(1) img");

          // Skip if essential elements are missing
          if (!name || !price_nodes || !image) {
            return;
          }

          const prices = price_nodes.querySelectorAll(
            "div.item-price.encrypt-price span.encrypt-num"
          );

          let product_price = "";

          prices.forEach((price) => {
            const pos = price.style.backgroundPosition;
            product_price += price_map[pos] || "";
          });

          const productNameElement = name.childNodes[0];
          const cleanName = productNameElement
            ? productNameElement.textContent.trim().replace(/\s+/g, " ")
            : name.textContent.trim().replace(/\s+/g, " ");

          // Create a unique ID from the image source
          const imageUrl = image.src;
          const id = productNode.attributes["id"].value.split("-")[2];

          products.push({
            id,
            name: cleanName,
            price: product_price,
            image: `https://www.kaitorishouten-co.jp${imageUrl}`,
          });
        } catch (error) {
          console.error("Error parsing product node:", error);
        }
      });

      // Add delay between requests to be respectful
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Handle file operations with proper error handling
    let prev_data = [];
    const filePath = path.join(
      process.cwd(),
      "public",
      "kaitori-iphone-products.json"
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
