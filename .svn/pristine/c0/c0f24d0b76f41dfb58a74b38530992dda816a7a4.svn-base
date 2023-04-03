const dbManager = require('../db/dbManager');
const { format, subDays, getDay, getHours, getMinutes } = require('date-fns');
let IntervalBreathLogId;
let dataStoragePeriod;
const intervalTime = 60 * 1000;

const deleteBreathLog = async (dataStoragePeriod) => {
  
  try {
    const dateOjbDate = format(subDays(new Date(),parseInt(dataStoragePeriod)), "yyyyMMdd");
    const dateOjbTime = format(new Date(), "HHmmss");
    const dateOjb = dateOjbDate + 'T' + dateOjbTime;

    const query = `DELETE FROM ob_breath_log WHERE datetime<='${dateOjb}'`
    const res = await dbManager.pgQuery(query);

    if(res && res.rowCount > 0) {
      return res;
    }

  } catch(err) {
    console.log('deleteBreathLog err:', err);
  }

};

exports.ManageBreathLog = () => {

  IntervalBreathLogId = setInterval(async () => {

    const date = new Date();
    if(getHours(date) === 1 && getMinutes(date) <= 1) {
      const queryString = `SELECT setting_value FROM ob_setting WHERE name='Breath Data Storage Period'`;
      const res = await dbManager.pgQuery(queryString);

      if(res && res.rows && res.rows.length > 0) {
        dataStoragePeriod = res.rows[0].setting_value;
        if(dataStoragePeriod > 0) {
          deleteBreathLog(dataStoragePeriod);
        };
      };
    };
  }, intervalTime);
  
}

exports.stopManageBreathLog = () => {
  clearInterval(IntervalBreathLogId);
}