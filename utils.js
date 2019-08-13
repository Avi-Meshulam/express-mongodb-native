'use strict';

// returns a copy of the input object with only the specified fields
const filterObj = (obj, fieldsToKeep) => {
  if (!fieldsToKeep || fieldsToKeep.length === 0) {
    return obj;
  }
  const result = {};
  Object.keys(obj).forEach(key => {
    if (fieldsToKeep.includes(key)) {
      result[key] = obj[key];
    }
  });
  return result;
};

module.exports = { filterObj };
