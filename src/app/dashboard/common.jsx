import { fabric } from "fabric";
import styles from "./common.modules.css";
import CanvasOutstyles from './FCanvasOutside.module.css';


export function initialComponentSize() { //현재 페이지 구성요소들의 크기 
    let dict = {};
    // dict['leftbar'] = document.getElementById('leftbar').offsetWidth;
    // dict['rightbar'] = document.getElementById('rightbar').offsetWidth;
    dict['navbar'] = document.getElementById('navbar') && document.getElementById('navbar').offsetHeight;
    dict['dashboard'] = document.getElementById('dashboard') && document.getElementById('dashboard').offsetWidth;
    dict['dashboard-content'] = document.getElementById('dashboard-content') && document.getElementById('dashboard-content').offsetWidth;
    return dict;
}

export function getInnerSize(canvas) {
    let dict = {};
    let component = canvas.componentSize;
    // dict['innerWidth'] = window.innerWidth - (component['leftbar'] + component['rightbar']);
    dict['innerWidth'] = component['dashboard-content'];
    dict['innerHeight'] = window.innerHeight - component['navbar'];
    return dict;
}

export function setCanvasCenter(canvas) { //캔버스 가운데에 위치 시키는 함수 
    if (canvas) {
        let inner = getInnerSize(canvas);
        let innerWidth = inner['innerWidth'];
        let innerHeight = inner['innerHeight'];
        let upperCanvas = document.getElementsByClassName('upper-canvas')[0];
        let lowerCanvas = document.getElementsByClassName('lower-canvas')[0];

        let styleWidth = upperCanvas.style.width.substr(0, upperCanvas.style.width.length - 2)
        let styleHeight = upperCanvas.style.height.substr(0, upperCanvas.style.height.length - 2)

        // let left = (innerWidth - styleWidth) / 2;
        // let top = (innerHeight - styleHeight) / 2;
        // let left = 0 - (document.getElementById('leftbar').offsetWidth);
        let left = 0;
        let top = 0;

        // if(top<100) top =100;
        upperCanvas.style.left = left + 'px';
        upperCanvas.style.top = top + 'px';

        lowerCanvas.style.left = left + 'px';
        lowerCanvas.style.top = top + 'px';
    }
}

export function zoom(canvas, ratio) {
    let canvasElem = document.getElementsByTagName('canvas');
    for (let i = 0; i < canvasElem.length; i++) {
        canvasElem[i].style.width = Math.floor(getCanvasStyleWidth() * ratio) + 'px';
        canvasElem[i].style.height = Math.floor(getCanvasStyleHeight() * ratio) + 'px';
    }
    setCanvasCenter(canvas);
}

export function getCanvasStyleWidth() {
    let upperCanvas = document.getElementsByClassName('upper-canvas')[0];
    return upperCanvas.style.width.substr(0, upperCanvas.style.width.length - 2);
}
export function getCanvasStyleHeight() {
    let upperCanvas = document.getElementsByClassName('upper-canvas')[0];
    return upperCanvas.style.height.substr(0, upperCanvas.style.height.length - 2);
}
export function setCanvasStyleSize(width, height) {
    let upperCanvas = document.getElementsByClassName('upper-canvas')[0];
    let lowerCanvas = document.getElementsByClassName('lower-canvas')[0];

    upperCanvas.style.width = width + 'px';
    upperCanvas.style.height = height + 'px';
    lowerCanvas.style.width = width + 'px';
    lowerCanvas.style.height = height + 'px';
}

export function fitToProportion(canvas) {
    let innerWidth = getInnerSize(canvas)['innerWidth'];
    let innerHeight = getInnerSize(canvas)['innerHeight'];
    canvas.zoomInfo = 1

    if (getCanvasStyleWidth() > innerWidth || getCanvasStyleHeight() > innerHeight) {
        while (1) {
            if (getCanvasStyleWidth() < getInnerSize(canvas)['innerWidth'] && getCanvasStyleHeight() < getInnerSize(canvas)['innerHeight']) break;
            canvas.zoomInfo -= 0.1;
            zoom(canvas, 0.9);
        }
        canvas.zoomInfo -= 0.1;
        zoom(canvas, 0.9);
    }

    if (getCanvasStyleWidth() < innerWidth || getCanvasStyleHeight() < innerHeight) {
        while (1) {
            if (getCanvasStyleWidth() * 1.1 < innerWidth && getCanvasStyleHeight() * 1.1 < innerHeight) {
                zoom(canvas, 1.1);
                canvas.zoomInfo += 0.1;
            }
            else return;
        }
    }
}

export function getMainImage(canvas) {
    let result = null;
    if (!canvas) return;
    let objects = canvas.getObjects();
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].main === true) {
            result = objects[i];
        }
    }
    return result
}

// export function getActiveObjectsByType(canvas, objectType) {
//     let results = []
//     let objects = canvas.getObjects();
//     objects.forEach((object) => {
//         if (object.type === objectType) results.push(object);
//     })
//     return results;
// }

export function mouseEventOff(canvas) {
    canvas.off('mouse:down');
    canvas.off('mouse:up');
    canvas.off('mouse:move');
    canvas.off('mouse:down:before');
    canvas.off('mouse:up:before');
}

// export function inputFigureInfo(object) {
//     if (!object) {
//         document.getElementById('figure-width').value = '';
//         document.getElementById('figure-height').value = '';
//         // document.getElementById('color').?;
//         // deactivateInput();
//     }
//     else {
//         document.getElementById('figure-width').value = Math.round(object.getScaledWidth());
//         document.getElementById('figure-height').value = Math.round(object.getScaledHeight());
//         document.getElementById('color').value = object.fill;
//     }
// }
