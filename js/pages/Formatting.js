const formattersDefinition = () => {

  const formatters = {
    arrayOfThings: (text, pattern) => {
      return text.replace(/\s/g, "").replace(",", "").match(pattern) || [];
    },
    arrayOfFloat: (text) => {
      const floatPattern = /-?\d+(\,|\.)?\d+/g;
      return formatters.arrayOfThings(text, floatPattern).map((t) => parseFloat(t));
    },
    // Converts the values coming as 1'2" 1 feet 2 inches to it's feet value.
    arrayOfFeet: (text) => {
      const feetInchesPattern = /-?\d+\'(\d+\")?/g;
      const feetInches = formatters.arrayOfThings(text, feetInchesPattern);
      return feetInches.map((fi) => {
        const [feets, inches] = formatters.arrayOfInts(fi);
        return feets + (inches ? inches * 0.083 : 0);
      })
    },
    arrayOfInts: (text) => {
      const intPatttern = /\d+/g;
      return formatters.arrayOfThings(text, intPatttern).map((t) => parseInt(t));
    },
    numberOnly: (text) => {
      const [first] = formatters.arrayOfFloat(text);
      return first || null;
    },
    dimensions: (text) => {
      const [width, length] = formatters.arrayOfFloat(text);
      return {
        width: width,
        length: length
      };
    }
  };

  return formatters;
}

module.exports = {
  formattersDefinition : formattersDefinition,
  formatters: formattersDefinition()
};
