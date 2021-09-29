export const getImageMimetype = (signature) => {
  switch (signature) {
    case "89504E47":
      return "image/png";
    case "47494638":
      return "image/gif";
    case "FFD8FFDB":
    case "49460001":
    case "FFD8FFEE":
    case "FFD8FFE1":
    case "69660000":
    case "FFD8FFE0":
      return "image/jpeg";
    default:
      return "not supported";
  }
};
