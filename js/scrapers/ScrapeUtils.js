const formatters = {
  arrayOfNumbers: (text) => {
    const floatPattern = /\d+(\,?\d+)?/g;
    return (text.replace(/\s/g, "").match(floatPattern) || []).map((t) => parseFloat(t));
  },
  numberOnly:(text) => {
    const [first] = formatters.arrayOfNumbers(text);
    return first || null;
  },
  dimensions :(text)=> {
    const [length, width] = formatters.arrayOfNumbers(text);
    return { width : width, length : length};
  }
}

module.exports = {
  formatters: formatters
}
