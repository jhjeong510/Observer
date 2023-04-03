const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
    name: 'Observer',
    description: 'Observer',
    script: path.join(__dirname, '..', 'server', 'bin', 'server.js'),  // 서버 폴더 내 빈폴더 내 server.js > 폴더 경로 아래 실행 스크린트
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ],
    /* wait 는 서비스에 문제가 발생하여 정지된 후 얼마 후에 재시작할지 설정하는 값입니다.*/
    wait: 2,    // 2초후에 재시작합니다.
    
    /* grow는 매 재시작시 딜레이가 추가되는데 이 딜레이 증가값입니다.
       예로 wait가 2이고 grow가 .5이면 문제가 발생하여 정지되고 2초후 첫번째 재시작을 하고
       다시 문제가 발생하면 2초+(2초*0.5) 해서 3초후 재시작 합니다.
       또다시 문제가 발생하면 3초+(3초*0.5) 해서 4.5초후 재시작 합니다.
    */
    grow: .5,   // 매 재시작시 지난번 딜레이에 50%를 더해서 재시작 합니다.
    
    /* maxRetries 는 총 재시작 횟수를 설정할 수 있습니다. 
       총 재시작 횟수를 넘으면 더이상 재시작을 시도하지 않습니다.
       기본값은 무한대 입니다. 
    */
    // maxRetries: 10,
    
    /* maxRestarts 는 60초안에 최대 재시작 횟수를 설정할 수 있습니다.
       기본값은 3 입니다. 60초안에 3번 문제가 발생하여 재시작을 3번 했으면 
       60초안에 더이상 재시작을 시도하지 않습니다.
    */
    // maxRestarts: 3,
    
    env: {
        name: "NODE_ENV",
        value: "production"
    }
});

svc.on('install', ()=> {
    svc.start();
});

svc.on('uninstall', ()=> {
    console.log('Uninstall complete');
    console.log('The service exists:', svc.exists);
});

const myArgs = process.argv.slice(2);
if (myArgs[0] === 'install') {
    svc.install();
} else if (myArgs[0] === 'uninstall') {
    svc.uninstall();
} else {
    console.log('usage: node service_manage.js [install/uninstall]');
}