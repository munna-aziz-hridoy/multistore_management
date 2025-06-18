import { JSDOM } from "jsdom";

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

export async function GET(request) {
  const cat_id = request.nextUrl.searchParams.get("cat_id");

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
    return Response.json(
      { error: `HTTP ${response.status}: ${response.statusText}` },
      { status: response.status }
    );
  }

  const htmlRawText = await response.text();

  const html = htmlRawText
    .replaceAll("\\n", "")
    .replaceAll("\\t", "")
    .replaceAll("\\", "");

  const document = new JSDOM(html).window.document;

  const productList = document.querySelectorAll("tbody tr");

  let products = [];

  Array.from(productList).forEach((productNode) => {
    const name = productNode.querySelector("td:nth-child(2)");
    const price_nodes = productNode.querySelector("td:nth-child(3)");
    const prices = price_nodes.querySelectorAll(
      "div.item-price.encrypt-price span.encrypt-num"
    );
    const image = productNode.querySelector("td:nth-child(1) img");

    let product_price = "";

    prices.forEach((price) => {
      const pos = price.style.backgroundPosition;

      product_price += price_map[pos];
    });

    const productNameElement = name.childNodes[0];
    const cleanName = productNameElement
      ? productNameElement.textContent.trim().replace(/\s+/g, " ")
      : name.textContent.trim().replace(/\s+/g, " ");

    products.push({
      name: cleanName,
      price: product_price,
      image: `https://www.kaitorishouten-co.jp${image.src}`,
    });
  });

  return Response.json({ status: "success", products: products });
}
