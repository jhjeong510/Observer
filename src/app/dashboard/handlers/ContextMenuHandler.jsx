import CanvasOutstyles from '../../shared/modal/ContextMenuModal.module.css';
import CanvasInstyles from '../../shared/modal/ContextMenuModal.module.css';
import CanvasParkingstyles from '../../shared/modal/ContextMenuModal.module.css';

export function ContextMenuHandler(canvas, clickXY, opt, inside, parking, selectedBox, clickPoint) {
    handleCloseContext();
    let className = ''
    if (inside) {
        className = CanvasInstyles.menuMapAddIcon;
        if ((opt.subTargets && opt.subTargets.length > 0) || (opt.target && opt.target.data && opt.target.data.type)) {
            // 실내
            switch (opt && opt.subTargets[0] && opt.subTargets[0].data ? opt.subTargets[0].data.type : opt.target.data.type) {
                case undefined:
                    className = CanvasInstyles.menuMapAddIcon;
                    break;
                case 'camera':
                    className = CanvasInstyles.menuMapCameraContext;
                    break;
                case 'door':
                    className = CanvasInstyles.menuMapDoorContext;
                    break;
                case 'vitalsensor':
                    className = CanvasInstyles.menuMapVitalsensorContext;
                    break;
                case 'guardianlite':
                    className = CanvasInstyles.menuMapGuardianliteContext;
                    break;
                case 'ebell':
                    className = CanvasInstyles.menuMapEbellContext;
                    break;
                case 'vcounter':
                    className = CanvasInstyles.menuMapVCounterContext;
                    break;
                case 'mdet':
                    className = CanvasInstyles.menuMapMdetContext;
                    break;
                default:
                    break;
            }
        }
    } else if (parking) {
        className = CanvasParkingstyles.parkingMenu;
    } else {
        className = CanvasOutstyles.menuMapAddIcon;
        if ((opt.subTargets && opt.subTargets.length > 0) || (opt.target && opt.target.data && opt.target.data.type)) {
            // 실외
            switch (opt && opt.subTargets[0] && opt.subTargets[0].data ? opt.subTargets[0].data.type : opt.target.data.type) {
                case undefined:
                    className = CanvasOutstyles.menuMapAddIcon;
                    break;
                case 'building':
                    className = CanvasOutstyles.menuMapBuildingContext;
                    break;
                case 'camera':
                    className = CanvasOutstyles.menuMapCameraContext;
                    break;
                case 'ebell':
                    className = CanvasOutstyles.menuMapEbellContext;
                    break;
                case 'guardianlite':
                    className = CanvasOutstyles.menuMapGuardianliteContext;
                    break;
                case 'pids':
                    className = CanvasOutstyles.menuMapPidsContext;
                    break;
                case 'vcounter':
                    className = CanvasOutstyles.menuMapVCounterContext;
                    break;
                case 'mdet':
                    className = CanvasOutstyles.menuMapMdetContext;
                    break;
                default:
                    break;
            }
        }
    }

    const menu = document.getElementsByClassName(`${className}`);
    menu[0].style.display = 'initial';
    const menuWidth = menu[0].offsetWidth;
    const menuHeight = menu[0].offsetHeight;
    const { innerWidth, innerHeight } = window;
    let pointX;
    let pointY;
    if (opt) {
        pointX = opt.pointer.x;
        pointY = opt.pointer.y;
    } else {
        pointX = clickPoint.x;
        pointY = clickPoint.y;
    }

    if (innerWidth < pointX + menuWidth) {
        pointX -= menuWidth
    }
    if (innerHeight < pointY + menuHeight) {
        pointY -= menuHeight
    }
    if (menu.length > 0 && menu[0] && menu[0].style) {
        menu[0].style.display = 'initial';
        menu[0].style.left = pointX + 'px';
        menu[0].style.top = pointY + 'px';
    }
    if (opt) {
        canvas.requestRenderAll();
    }
};

export function handleCloseContext() {
    const addBuildingMenu = document.getElementsByClassName(`${CanvasOutstyles.menuMapAddIcon}`);
    if (addBuildingMenu && addBuildingMenu.length > 0) {
        addBuildingMenu[0].style.display = 'none';
    }

    const removeBuildingMenu = document.getElementsByClassName(`${CanvasOutstyles.menuMapBuildingContext}`);
    if (removeBuildingMenu && removeBuildingMenu.length > 0) {
        removeBuildingMenu[0].style.display = 'none';
    }

    const removeCameraMenu = document.getElementsByClassName(`${CanvasOutstyles.menuMapCameraContext}`);
    if (removeCameraMenu && removeCameraMenu.length > 0) {
        removeCameraMenu[0].style.display = 'none';
    }

    const removeEbellMenu = document.getElementsByClassName(`${CanvasOutstyles.menuMapEbellContext}`);
    if (removeEbellMenu && removeEbellMenu.length > 0) {
        removeEbellMenu[0].style.display = 'none';
    }

    const removePidsMenu = document.getElementsByClassName(`${CanvasOutstyles.menuMapPidsContext}`);
    if (removePidsMenu && removePidsMenu.length > 0) {
        removePidsMenu[0].style.display = 'none';
    }

    const removeVCounterMenu = document.getElementsByClassName(`${CanvasOutstyles.menuMapVCounterContext}`);
    if (removeVCounterMenu && removeVCounterMenu.length > 0) {
        removeVCounterMenu[0].style.display = 'none';
    }

    const removeMdetMenu = document.getElementsByClassName(`${CanvasOutstyles.menuMapMdetContext}`);
    if (removeMdetMenu && removeMdetMenu.length > 0) {
        removeMdetMenu[0].style.display = 'none';
    }

    const removeInMenu = document.getElementsByClassName(`${CanvasInstyles.menuMapAddIcon}`);
    if (removeInMenu && removeInMenu.length > 0) {
        removeInMenu[0].style.display = 'none';
    }

    const removeInCameraMenu = document.getElementsByClassName(`${CanvasInstyles.menuMapCameraContext}`);
    if (removeInCameraMenu && removeInCameraMenu.length > 0) {
        removeInCameraMenu[0].style.display = 'none';
    }

    const removeInDoorMenu = document.getElementsByClassName(`${CanvasInstyles.menuMapDoorContext}`);
    if (removeInDoorMenu && removeInDoorMenu.length > 0) {
        removeInDoorMenu[0].style.display = 'none';
    }

    const removeInVitalsensorMenu = document.getElementsByClassName(`${CanvasInstyles.menuMapVitalsensorContext}`);
    if (removeInVitalsensorMenu && removeInVitalsensorMenu.length > 0) {
        removeInVitalsensorMenu[0].style.display = 'none';
    }

    const removeInGuardianliteMenu = document.getElementsByClassName(`${CanvasInstyles.menuMapGuardianliteContext}`);
    if (removeInGuardianliteMenu && removeInGuardianliteMenu.length > 0) {
        removeInGuardianliteMenu[0].style.display = 'none';
    }

    const removeInEbellMenu = document.getElementsByClassName(`${CanvasInstyles.menuMapEbellContext}`);
    if (removeInEbellMenu && removeInEbellMenu.length > 0) {
        removeInEbellMenu[0].style.display = 'none';
    }

    const removeParkingMenu = document.getElementsByClassName(`${CanvasInstyles.parkingMenu}`);
    if (removeParkingMenu && removeParkingMenu.length > 0) {
        removeParkingMenu[0].style.display = 'none';
    }

    const removeInVCounterMenu = document.getElementsByClassName(`${CanvasInstyles.menuMapVCounterContext}`);
    if (removeInVCounterMenu && removeInVCounterMenu.length > 0) {
        removeInVCounterMenu[0].style.display = 'none';
    }

    const removeInMdetMenu = document.getElementsByClassName(`${CanvasInstyles.menuMapMDetContext}`);
    if (removeInMdetMenu && removeInMdetMenu.length > 0) {
        removeInMdetMenu[0].style.display = 'none';
    }
}