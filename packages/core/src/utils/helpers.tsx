export const copyToClipboard = (text: string) => {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
};

// Format number to return a user friendly string
export const numberWithCommas = (x: number): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const prefixHTTPS = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    return "http://" + url;
  }

  return url;
};