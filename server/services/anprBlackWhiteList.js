const dbManager = require("../db/dbManager");

const blackList = new Map();
const whiteList = new Map();

exports.isBlackList = async (number) => {
  try {
    if (typeof number !== 'string') {
      return false;
    }
    const result = blackList.has(number);
    return result;
  } catch (err) {
    return undefined;
  }
}

exports.isWhiteList = async (number) => {
  try {
    if (typeof number !== 'string') {
      return false;
    }
    return whiteList.has(number);    
  } catch (err) {
    return undefined;
  }
}

exports.loadBlackWhiteList = async () => {
  try {
    blackList.clear();
    whiteList.clear();
    const query = 'SELECT * FROM ob_car_number';
    const res = await dbManager.pgQuery(query);
    if (res && res.rows && res.rows.length > 0) {
      res.rows.forEach(item => {
        if (item.type === 'black') {
          if (item.number.length > 3) {
            blackList.set( item.number.substring(item.number.length - 4), { number: item.number, name: item.name, description: item.description });
          } else {
            blackList.set( item.number, { number: item.number, name: item.name, description: item.description });
          }          
        } else if (item.type === 'white') {
          if (item.number.length > 3) {
            whiteList.set(item.number.substring(item.number.length - 4), { number: item.number, name: item.name, description: item.description });
          } else {
            whiteList.set(item.number, { number: item.number, name: item.name, description: item.description });
          }
        }
      })
    }
  } catch (err) {
    console.log('err:', err);
  }
}


exports.blackList = blackList;
exports.whiteList = whiteList;