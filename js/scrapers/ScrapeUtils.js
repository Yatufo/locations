const formatters = {
  arrayOfNumbers: (text) => {
    const floatPattern = /\d+\,?\d+/g;
    return (text.replace(/\s/g, "").replace(",", "").match(floatPattern) || []).map((t) => parseInt(t));
  },
  numberOnly: (text) => {
    const [first] = formatters.arrayOfNumbers(text);
    return first || null;
  },
  dimensions: (text) => {
    const [width, length] = formatters.arrayOfNumbers(text);
    return { width: width, length: length};
  }
}

module.exports = {
  formatters: formatters
}
