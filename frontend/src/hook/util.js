/**
 * Formats the labels adding spacing ("camelCase" to "Camel Case")
 * @param dataLabel String representing the raw label
 * @returns {string} String of the formatted label
 */
export function dataLabelsSpace(dataLabel) {
    return dataLabel
        .replace(/([A-Z])/g, ' $1') // insert a space before all caps
        .replace(/^./, function(str){ return str.toUpperCase(); }); // uppercase the first character
}

export function capitalized(str)  {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }