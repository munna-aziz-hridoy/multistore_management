import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export function woo_api(credential) {
  if (credential) {
    const { domain, ck, cs } = credential;
    const api = new WooCommerceRestApi({
      url: domain,
      consumerKey: ck,
      consumerSecret: cs,
      version: "wc/v3",
    });
    return api;
  } else return null;
}
