import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export function woo_api(credential) {
  if (credential) {
    const { domain, ck, cs } = credential;

    let url = domain;

    if (domain[domain.length - 1] === "/") {
      url = domain.slice(0, -1);
    }

    const api = new WooCommerceRestApi({
      url: url,
      consumerKey: ck,
      consumerSecret: cs,
      version: "wc/v3",
    });
    return api;
  } else return null;
}
