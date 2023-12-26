export const firebaseMessageExtract = (text) => {
  return text.split("(")[1].split("/")[1].split(")")[0].split("-").join(" ");
};
