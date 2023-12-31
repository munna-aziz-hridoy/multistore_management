"use client";

import React, { useState, useEffect } from "react";

// import "@shopify/shopify-api/adapters/node";
// import { ApiVersion, shopifyApi } from "@shopify/shopify-api";

// import Shopify from "shopify-api-node";

const domain = "https://quickstart-7fbff8a5.myshopify.com";
const apiKey = "7eab90cf97b8964ea8db8dbab9aa9df5";
const apiSecret = "96887429354e83dd1fa90545c097ccb4";
const scopes = ["read_products"];
const accessToken = "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";

function Setting() {
  const [products, setProducts] = useState([]);

  // const shopify = new Shopify({
  //   shopName: "quickstart-7fbff8a5.myshopify.com",
  //   apiKey: "7eab90cf97b8964ea8db8dbab9aa9df5",
  //   password: "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",
  //   autoLimit: true,
  // });

  useEffect(() => {
    fetch(`${domain}/admin/api/2022-04/products.json`, {
      headers: {
        "X-Shopify-Access-Token": "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",
        "content-type": "application/json",
        Authorization: `${btoa(`${apiKey}:${accessToken}`)}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data?.products);
      });
  }, []);

  return (
    <div>
      <h1>Setting</h1>
      <ul>
        {products.map((product) => (
          <li key={product?.id}>{product?.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Setting;
