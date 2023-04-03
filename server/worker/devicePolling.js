const axios = require('axios');
const dbManager = require('../db/dbManager');
const axiosRetry = require('axios-retry');
const qs = require('qs')
const FormData = require('form-data');

let timerId;
const pollingInterval = 30000;

const collectGuardianliteInfo = async (idx, ipaddress, id, password) => {
  axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => {
      return retryCount * 1000
    }
  })

  try {
    if (idx && ipaddress) {
      let timeout =5000;
      let resGuardianlite = null;
      const CancelToken = axios.CancelToken;
      let cancel;
      setTimeout(() => {
        if (resGuardianlite === null){
          cancel && cancel('가디언라이트 연결 시간 초과');
        }
      }, timeout);
      let form = new FormData();
      form.append('id', id);
      form.append('password', password);
      await axios({
        method: 'post',
        url:  `http://${ipaddress}`,
        data: qs.stringify(form),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        cancelToken: new CancelToken((c) => {
          cancel = c;
        }),
      }).then((res) => {
        resGuardianlite = res;
      }).catch((err) => {
        console.log('guardianlite axios login err: ', err);
      })
      // 가디언라이트에 http get 요청
      if (resGuardianlite && resGuardianlite.data && resGuardianlite.data.indexOf('Login') === -1) {
        // 문자열 형식의 응답을 채널별 특정문자로 분할
        const arrSplit1 = resGuardianlite.data.split('<a href="?R');
        const arrSplit2 = resGuardianlite.data.split('<table border="1"><tr>');
        const channel = [];
        let temper;
        // 9개로 분할된 문자열 배열에서 각 채널의 ON/OFF 상태 문자열 검출 및 장비 온도 검출
        if (arrSplit1.length >= 9) {
          arrSplit1.map((str, index) => {
            if (index === 8) {
              const indexChStart = str.indexOf(`${index}=`);
              const indexChLast = str.indexOf(`">`);
              const ch = str.substring(indexChStart+2,indexChLast);
              channel.push(ch);
  
              const indexTemperStart = str.indexOf(`</table>`);
              const indexTemperLast = str.indexOf('</h1>');
              temper = str.substring(indexTemperStart+8,indexTemperLast);
            } else if (index === 1) {
              const indexChStart = str.indexOf(`=`);
              const indexChLast = str.indexOf('">');
              const ch = str.substring(indexChStart+1,indexChLast);
              channel.push(ch);
            } else if (index > 1) {
              const indexChStart = str.indexOf(`${index}=`);
              const indexChLast = str.indexOf(`">`);
              const ch = str.substring(indexChStart+2,indexChLast);
              channel.push(ch);
            }
          });
  
          if (channel.length >= 8 && temper) {      
            //console.log(`guardianlite(${ipaddress}) ch1:${channel[0]}, ch2:${channel[1]}, ch3:${channel[2]}, ch4:${channel[3]}, ch5:${channel[4]}, temper:${temper}`);            
            querySelect = `SELECT * FROM ob_guardianlite WHERE idx=${idx}`;
            const resSelect = await dbManager.pgQuery(querySelect);
            if (resSelect && resSelect.rows && resSelect.rows.length > 0){
              const old = resSelect.rows[0];
              if (old.ch1 !== channel[0] || old.ch2 !== channel[1] ||
                old.ch3 !== channel[2] || old.ch4 !== channel[3] ||
                old.ch5 !== channel[4] || old.ch6 !== channel[5] ||
                old.ch7 !== channel[6] || old.ch8 !== channel[7] ||
                old.temper !== temper) 
              {
                const queryStringGl = `UPDATE "ob_guardianlite" SET 
                  ch1='${channel[0]}', 
                  ch2='${channel[1]}', 
                  ch3='${channel[2]}', 
                  ch4='${channel[3]}', 
                  ch5='${channel[4]}', 
                  ch6='${channel[5]}', 
                  ch7='${channel[6]}', 
                  ch8='${channel[7]}', 
                  temper='${temper}',
                  updated_at=NOW()                  
                  WHERE idx=${idx};`; 

                const resGlUpdate = await dbManager.pgQuery(queryStringGl);
                const updateGlStatus = `UPDATE ob_device SET status=0, updated_at=NOW() WHERE ipaddress='${ipaddress}' AND status!=0`;
                const updateGlStatusRes = await dbManager.pgQuery(updateGlStatus);
                if(global.websocket && updateGlStatusRes && updateGlStatusRes.rowCount > 0){
                  global.websocket.emit('guardianlites', { guardianlites: updateGlStatusRes.rowCount});
                  global.websocket.emit("deviceList", { deviceList: updateGlStatusRes.rowCount});
                }
              }
            }
          } else {
            console.log(`guardianlite 응답결과파싱값 오류: 파싱채널수 ${channel.length}, 온도값:${temper}`);
          }
        } else {
          console.log(`guardianlite 응답결과 문자열 분할수(ch) 오류: split수 ${arrSplit1.length.length}`);
        }
        return resGuardianlite.data;
      } else {
        throw new Error('Guardianlite Login Failed.');
      }
    } else {
      console.log(`collectGuardianliteInfo: 장비의 idx(${idx})나 ipaddress(${ipaddress})가 올바르지 않습니다.`);
    }
  } catch(err) {
    const updateGlCh = `UPDATE ob_guardianlite SET ch1=NULL, ch2=NULL, ch3=NULL, ch4=NULL, ch5=NULL, updated_at=NOW() WHERE idx=${idx} AND ipaddress='${ipaddress}'`;
    const updateGlStatus = `UPDATE ob_device SET status=1, updated_at=NOW() WHERE ipaddress='${ipaddress}' AND status!=1`;
    const updateGlChRes = await dbManager.pgQuery(updateGlCh);
    const updateGlStRes = await dbManager.pgQuery(updateGlStatus);
    if(global.websocket && updateGlChRes.rowCount > 0 && updateGlStRes.rowCount > 0) {
      global.websocket.emit('guardianlites', { 
        guardianlites: updateGlChRes.rowCount 
      });
      global.websocket.emit("deviceList", {
        deviceList: updateGlStRes.rowCount
      });
    }
    console.log('collectGuardianliteInfo:', err);
  }  
}

const pollingGuardianlite = async () => {
  try {
    // 전체 가디언라이트 장비 DB에서 읽기
    const queryAll = `SELECT * FROM ob_guardianlite`;
    const resAll = await dbManager.pgQuery(queryAll);
    if (resAll && resAll.rows && resAll.rows.length > 0) {
      resAll.rows.forEach(async (device) => {
        await collectGuardianliteInfo(device.idx, device.ipaddress, device.id, device.password);
      });
    } else {
      //console.log('등록된 가디언라이트 장비수:0개');
    }
    
    // updated_at과 upserted_at 시간을 비교하여 변경된 내용이 있는지 확인
    const queryStringDiff = `SELECT COUNT(*) AS cnt FROM "ob_guardianlite" WHERE updated_at != upserted_at;`;
    const resDiff = await dbManager.pgQuery(queryStringDiff);
    if (resDiff && resDiff.rows && resDiff.rows.length>0){
      if (resDiff.rows[0].cnt > 0){
        if (global.websocket) {
          global.websocket.emit("guardianlites", { guardianlite: resDiff.rows[0].cnt });
          //console.log('socket emit guardianlite');
          
          const queryUpsertTime = `UPDATE "ob_guardianlite" SET updated_at = upserted_at WHERE updated_at != upserted_at;`;
          const resUpsertTime = await dbManager.pgQuery(queryUpsertTime);
          //resUpsertTime.rowCount 값이 update 수행된 수
          //console.log('socket emit & update result:', resUpsertTime);
        }
      }
    }
  } catch (error) {
    console.log('polling guardianlite:', error);
  }
}

exports.startDevicePolling = () => {
  timerId = setInterval(() => {
  //timerId = setTimeout(()=>{
    const date = new Date();
    //console.log('========================================================');
    //console.log(`[${format(date, 'yyyy-MM-dd HH:mm:ss')}] 장비상태읽기 Polling`);
    
    pollingGuardianlite();

  }, pollingInterval);
}

exports.stopDevicePolling = () => {
  clearInterval(timerId);
}
