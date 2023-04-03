const dbManager = require('../db/dbManager');

let timerId;
const checkingInterval = 5000;

const checkingSelectControl = async () => {
    try {
        const query = `SELECT DISTINCT ON (A.deviceid) A.id, A.deviceid, A.statusid, A.eventdatetime, 
            A.adminconfirm, A.lastupdatedatetime, B.detectioncount, B.name, B.state 
            FROM system_log A LEFT OUTER JOIN data_device_camera B ON A.deviceid = B.id 
            WHERE type = 'DETECTION' and A.adminconfirm = 'false' ORDER BY A.deviceid, A.lastupdatedatetime DESC limit 4`;
        const res = await dbManager.pgQuery(query);
        console.log('selectcontrol db check:', res);
        const urls = res.rows.map(row => {
            //return `http://root:root@192.168.10.17:89/live/media/DESKTOP-RAROBF0/DeviceIpint.${row.deviceid}/SourceEndpoint.video:0:0?w=800&h=600`;
            return `http://root:root@192.168.10.17:89/live/media/DESKTOP-RAROBF0/DeviceIpint.8/SourceEndpoint.video:0:0?w=800&h=600`;
        });

        if (global.websocket) {
            global.websocket.emit("selectioncontrol", { urls: urls });
        }
    } catch (error) {
        console.log(error);
    }
}

exports.startSelectControlChecking = () => {
    timerId = setInterval(()=>{
    //timerId = setTimeout(()=>{
        checkingSelectControl();
    }, checkingInterval);    
}

exports.stopSelectControlChecking = () => {
    clearInterval(timerId);
}