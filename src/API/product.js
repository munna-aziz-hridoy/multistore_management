import { woo_api } from "@/config";

export const updateProduct = (credential, data) => {
  const id = data?.id;
  delete data.id;

  woo_api(credential).put(`/products/${data.id}`, data);
};

export const updateBatchProducts = (credential, data) => {};
