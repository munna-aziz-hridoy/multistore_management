import Shopify from "@shopify/shopify-api";

export function shopify_api(credential) {
  if (credential) {
    const { domain, ck, cs } = credential;

    // Initialize the Shopify context (Do this only once, preferably in a separate config file)
    Shopify.Context.initialize({
      API_KEY: "7eab90cf97b8964ea8db8dbab9aa9df5", // Your API key
      API_SECRET_KEY: "96887429354e83dd1fa90545c097ccb4", // Your API secret
      SCOPES: ["read_products"], // Scopes for the access token
      HOST_NAME: domain.replace(/https?:\/\//, ""), // Remove 'https://' from domain
      IS_EMBEDDED_APP: false,
      API_VERSION: Shopify.Context.API_VERSIONS.UNSTABLE, // or specify a stable API version
    });

    // Create a new instance of the REST client for the shop
    const client = new Shopify.Clients.Rest(
      domain,
      Shopify.Context.API_SECRET_KEY
    );

    return client;
  } else {
    return null;
  }
}

// export function shopify_api(credential) {
//   if (credential) {
//     const { domain, ck, cs } = credential;

//     // const shopify = new Shopify({
//     //   shopName: domain,
//     //   apiKey: ck,
//     //   password: cs,
//     // });

//     const shopify = new Shopify.shopifyApi({
// apiSecretKey: "96887429354e83dd1fa90545c097ccb4",
// apiKey: "7eab90cf97b8964ea8db8dbab9aa9df5",
// shopName: "https://quickstart-7fbff8a5.myshopify.com",
// adminApiAccessToken: "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",
// scopes: ["read_products"],
//     });

//     const rest = new shopify.clients.Rest();

//     return rest;
//   } else return null;
// }
