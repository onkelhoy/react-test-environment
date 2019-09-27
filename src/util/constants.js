/* eslint-disable no-extend-native */
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

/**
 * same-ish as checking if two objects are the same
 * but this time, we check if target has all properties that source 
 * (target can have more)
 * @param {Object} s 
 * @param {Object} t 
 */
export const sourceInTarget = (s, t) => {
  if (s instanceof Array)
  {
    if (!(t instanceof Array)) return false;
    else if (s.length > t.length) return false;
    else 
    {
      for (let i=0; i<s.length; i++)
      {
        if (!sourceInTarget(s[i], t[i])) return false;
      }
    }
  }
  else if (s instanceof Object) 
  {
    if (t instanceof Array) return false;
    else if (!(t instanceof Object)) return false; 
    else 
    {
      for (let key in s)
      {
        if (!sourceInTarget(s[key], t[key])) return false;
      }
    }
  }
  else if (s !== t) return false;


  return true; // passed all tests
}

export const sameObjects = (a, b) => {
  if (a === b)
  {
    return true; // same 
  }

  if (!(a instanceof Object && b instanceof Object))
  {
    return false;
  }

  // if a is Array 
  if (a instanceof Array)
  {
    if (b instanceof Array)
    {
      if (a.length !== b.length)
        return false;
      else 
      {
        // both a & b is Array, [check content]
        for (let i=0; i<a.length; i++) 
        {
          if (!sameObjects(a[i], b[i])) return false;
        }
      }
    }
    else return false;
  }
  else // a -> Object 
  { 
    if (b instanceof Array) 
      return false;
    else 
    {
      if (Object.keys(a).length !== Object.keys(b).length)
        return false;
      else 
      {
        for (let key in a)
        {
          if (!sameObjects(a[key], b[key])) return false;
        }
      }
    }
  }

  return true; // it passed all tests
}