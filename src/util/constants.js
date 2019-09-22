import * as d3 from 'd3';

export const SafeAddition    = (a, b) => Math.round((a + b) * 1e12) / 1e12;
export const SafeSubtraction = (a, b) => Math.round((a - b) * 1e12) / 1e12;

export const skalarInput = value => (value[value.length-1] !== "s")? d3.format(',')(value): value.slice(0, -1)

export const skalarParser = value => {
  if (!value) return 0
  if (value[value.length-1] !== ",") {
    value = value.replace('.', '')
    value = value.replace(',', '.')
    return Math.floor(Math.round(parseFloat(value)*1000) / 10) / 100
  } else return value + "s" // string value flag
}

export const percentInput = value => value[value.length-1] !== "s"?
  `${(Math.floor(value*10000)/100).toString().replace('.', ',')}%`: `${value.slice(0, -1)}%`

  export const percentParser = value => {
  value = value.replace(/ ?%/g, '')
  if (!value) return 0
  if (value[value.length-1] !== ",") {
    value = value.replace(',', '.')
    return Math.floor(Math.round(parseFloat(value)*1000) / 10) / 10000
  } else return value + "s" // string value flag
}