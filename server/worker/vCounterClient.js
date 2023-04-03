const net = require('net');

const dbManager = require("../db/dbManager");
let isConnected = false;

const connectTcp = (ipaddress, port) => {
   console.log('vCounter 연결 요청: ', ipaddress, port)
   console.log(`try connecting to VCounter ${ipaddress}`);
   let socket = net.connect({
      host: ipaddress,
      port: port
   });

   socket.on('connect', () => {
      console.log(`VCounter tcp socket connected(${ipaddress})`);
      global.VCounterSocket = socket;
   });

   socket.on('data', async (data) => {
      console.log(`buffer length: ${data.length}`);
      if (data.length === 26) {
         // const buffer = Buffer.from(data);
         // const hexString = buffer.toString('hex');
         // const packetData = [...hexString];
         // let bytes = packetData.join('');
         // if (bytes.length % 2 !== 0) {
         //    bytes = bytes.substring(0, bytes.length - 1);
         // }


         const buffer = Buffer.from(data, 'hex');
         const value = buffer.readInt16BE(14);
         const binaryValue = value.toString(2).padStart(16, '0');
       
         const normalInCount = binaryValue[15];
         const reverseInCount = binaryValue[14];
         const normalOutCount = binaryValue[13];
         const reverseOutCount = binaryValue[12];
       
         let eventTrigger = '';
         if (normalInCount === '1') {
           eventTrigger = 'Normal Entry';
         } else if (reverseInCount === '1') {
           eventTrigger = 'Reverse Entry';
         } else if (normalOutCount === '1') {
           eventTrigger = 'Normal Exit';
         } else if (reverseOutCount === '1') {
           eventTrigger = 'Reverse Exit';
         }
       

         console.log(eventTrigger);



         // const bytesData = bytes.substring(30, 34);
         // const value = parseInt(bytesData, 16);
         // const binaryValue = value.toString(2).padStart(8, "0");
         // console.log(binaryValue);

         // const normalInCount = binaryValue[7];
         // const reverseInCount = binaryValue[6];
         // const normalOutCount = binaryValue[5];
         // const reverseOutCount = binaryValue[4];

         let query = `UPDATE ob_vcounter_count SET `;
         let setQuery = '';
         let condition = ` WHERE ipaddress = '${ipaddress}'`;

         if (normalInCount === '1') {
            setQuery += `in_count = in_count + 1`;
         }
         if (reverseInCount === '1') {
            setQuery += `in_count = in_count - 1`;
         }
         if (normalOutCount === '1') {
            setQuery += `out_count = out_count - 1`;
         }
         if (reverseOutCount === '1') {
            setQuery += `out_count = out_count + 1`;
         }

         if (setQuery) {
            query += setQuery + condition;
         }
         const result = await dbManager.pgQuery(query);

         try {
            if (result && result.rowCount > 0 && global.websocket) {
               global.websocket.emit("vCounterInfo", {
                  vCounterInformation: {
                     emptySlots,
                     inCount,
                     outCount,
                     vehicleCount
                  }
               });
            }
         } catch (err) {
            console.log('vcounter data received err: ', err)
         }
      }
   });


   socket.on('close', () => {
      console.log(`VCounter connection close(${ipaddress})`);
      global.VCounterSocket = undefined;

      setTimeout(() => {
         connectTcp(ipaddress, port);
      }, 5000);
   });

   socket.on('error', (err) => {
      console.log(`VCounter error(${ipaddress}) ${err.code}`);
   });
}

exports.connectVCOUNTER = async () => {
   const isTableQuery = `SELECT EXISTS(
                    SELECT * FROM information_schema.tables 
                    WHERE
                      table_schema = 'public'
                      AND
                    TABLE_NAME = 'ob_vcounter_count'
                    );`
   const isTableRes = await dbManager.pgQuery(isTableQuery);
   const query = `SELECT * FROM ob_vcounter_count`;
   if (isTableRes && isTableRes.rows && isTableRes.rows.length > 0 && isTableRes.rows[0].exists) {


      const res = await dbManager.pgQuery(query);
      if (res && res.rows && res.rows.length > 0) {
         res.rows.forEach((vCounter) => {
            connectTcp(vCounter.ipaddress, vCounter.port);
         });
         isConnected = true;
      }
   } else if (isConnected === false) {
      this.connectVCOUNTER();
   }
}

exports.disconnectVCounter = () => {
   if (global.VCounterSocket !== undefined) {
      global.VCounterSocket.destroy();
   }
}
