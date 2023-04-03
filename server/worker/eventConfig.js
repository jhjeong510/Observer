const dbManager = require('../db/dbManager');

const eventTypes = new Map();

exports.loadEventTypeConfig = async () => {
  try {
    eventTypes.clear();

    const query = `SELECT * FROM ob_event_type`;
    const res = await dbManager.pgQuery(query);
    if (res && res.rows && res.rows.length > 0) {
      res.rows.forEach((event) => {
        eventTypes.set(event.idx, event);
      });
      const respirationUnuse = res.rows[0].unused;
      global.respirationUnuse = respirationUnuse;
    }
  } catch(err){
    console.log('loadEventConfig err:', err);
  }
}

exports.get = async (eventTypeIdx) => {
    return eventTypes.get(eventTypeIdx);
}

module.eventTypes = eventTypes;