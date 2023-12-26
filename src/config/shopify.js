import "@shopify/shopify-api/adapters/node";
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";

export function shopify_api(credential) {
  if (credential) {
    const { domain, ck, cs } = credential;

    return shopifyApi({
      apiKey: ck,
      apiSecretKey: cs,
      scopes: ["read_products"],
      hostName: domain,
      apiVersion: LATEST_API_VERSION,
    });
  } else return null;
}
