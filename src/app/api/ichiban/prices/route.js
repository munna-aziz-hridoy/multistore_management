import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

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
      return Response.json(
        { error: `HTTP ${response.status}: ${response.statusText}` },
        { status: response.status }
      );
    }

    const htmlRawText = await response.text();

    const document = new JSDOM(htmlRawText).window.document;

    const productList = document.querySelectorAll(
      ".col-6.col-md-4.col-lg-3.mb-1"
    );

    Array.from(productList).forEach((productNode) => {
      const name = productNode
        .querySelector("label.hideText.mb-0.px-2.w-100")
        .textContent.trim()
        .replace(/\s+/g, " ");

      const price = productNode
        .querySelector("label.mb-0.text-right")
        .textContent.trim();

      const image =
        productNode.querySelector("img.card-img-top").attributes["src"].value;

      const id = image.split("/").pop().split(".")[0].split("_")[0];

      products.push({
        id,
        name: name,
        price: price,
        image: `https://www.mobile-ichiban.com/${image}`,
      });
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const prev_data = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "public", "ichiban-products.json"),
      "utf8"
    )
  );

  // Create a map of previous products by name for quick lookup
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
  fs.writeFileSync(
    path.join(process.cwd(), "public", "ichiban-products.json"),
    JSON.stringify(products, null, 2)
  );

  return Response.json({
    status: "success",
    products: productsWithChanges,
    totalProducts: products.length,
    changedProducts: productsWithChanges.filter((p) => p.changed).length,
  });
}
