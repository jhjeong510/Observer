import React from 'react';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlTileLayer from 'ol/layer/Tile';
import OlTileWMS from 'ol/source/TileWMS';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import OlStyle from 'ol/style/Style';
import OlIcon from 'ol/style/Icon';
import OlText from 'ol/style/Text';
import OlStroke from 'ol/style/Stroke';
import OlFill from 'ol/style/Fill';
import OlMousePosition from 'ol/control/MousePosition';
import OlDoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import { createStringXY } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { unByKey } from 'ol/Observable';
import Overlay from 'ol/Overlay';
import ContextMenu from 'ol-contextmenu';
import ScaleLine from 'ol/control/ScaleLine';
import { UserInfoContext } from '../context/context';

import axios from 'axios';
import { Modal, Form, Button, Container, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ModalConfirm from './ModalConfirm';

export class GMap extends React.Component {
  static contextType = UserInfoContext;

  constructor(props) {
    super(props);

    this.mapRef = React.createRef();

    this.state = {
      map: undefined,
      vectorLayer: undefined,
      buildingList: [],
      floorList: [],
      floorImageList: [],
      clickPoint: [],
      clickPoint2: [],
      selectedFeature: undefined,
      selectedFeature2: undefined,
      selectedFeature3: undefined,

      showCameraModal: false,
      modalCameraLatitude: '',
      modalCameraLongitude: '',
      modalCameraWarn: '',
      modalCurrentCamera: undefined,

      showBuildingModal: false,
      modalBuildingLatitude: '',
      modalBuildingLongitude: '',
      modalBuildingWarn: '',
      modalServiceType: undefined,
      modalCurrentBuilding: undefined,

      showFloorModal: false,
      modalFloorLatitude: '',
      modalFloorLongitude: '',
      modalFloorWarn: '',
      modalCurrentFloor: undefined,
      modalFloorMapImage: '',

      showFloorModifyModal: false,
      modalmodifyFloor: undefined,

      showBuildingModifyModal: false,
      modalmodifyBuilding: undefined,
	  
      showGuardianModal: false,
      modalGuardianLatitude: '',
      modalGuardianLongitude: '',
      modalGuardianWarn: '',
      modalGuardianName: '',

	  showDelConfirm: false,
      modalConfirmTitle: '',
      modalConfirmMessage: '',
      modalConfirmBtnText: '',
      modalConfirmCancelBtnText: '',
      modalConfirmIdx: undefined,
      modalConfirmServiceType: undefined,
     modalConfirmFloorName: undefined,
      testFeatureId: '',
      modalGroupImageId: '',

	  testFeatureName:'',
      currGuardianlite: '',
      guardianliteCh1: undefined,
      guardianliteCh2: undefined,
      guardianliteCh3: undefined,
      guardianliteCh4: undefined,
      guardianliteCh5: undefined,
      guardianliteCh6: undefined,
      guardianliteCh7: undefined,
      guardianliteCh8: undefined,
      guardianliteTemper: undefined,

      delFloorModal: false,

      buildingFloorList: [],
      showAlert: false,
      device_id: undefined,
      device_type: undefined,
      service_type: undefined,

      // 장치 팝업창 디자인 분류
      cameraPopup: 'ol-popup',
      ebellPopup: "ol-ebell-popup"
    };
  }

  animate = (evt) => {
    const frameState = evt.frameState;
    const elapsed = frameState.time - this.animationStart;
    if (elapsed >= 600) {
      if (this.state.vectorLayer) {
        const source = this.state.vectorLayer.getSource();
        const features = source.getFeatures();
        features.map((feature, index) => {
          if (feature.get('eventStatus') === 1 || feature.get('eventStatus') === "1") {
            if (feature.get('type') === 'ebell') {
              feature.set('type', 'ebell_event');
            } else if (feature.get('type') === 'ebell_event') {
              feature.set('type', 'ebell');
            } else if (feature.get('type') === 'camera') {
              feature.set('type', 'camera_event');
            } else if (feature.get('type') === 'camera_event') {
              feature.set('type', 'camera');
            } else if (feature.get('type') === 'building') {
              feature.set('type', 'building_event');
            } else if (feature.get('type') === 'building_event') {
              feature.set('type', 'building');
            }
          }
          return feature;
        })
      }
      this.animationStart = new Date().getTime();
    }
    this.state.map.render();
  }

  componentWillUnmount() {
    unByKey(this.listenerKey);
  }

  readFloorImageList = async () => {
    try {
      const res = await axios.get('/api/observer/mapimage', {
        params: {
          limit: 50
        }
      });

      // console.log('leftbar mapImage res:', res);
      if (res.data && res.data.result && res.data.result.length > 0) {
        this.setState({ floorImageList: res.data.result });
      }
    } catch (err) {
      console.log('gmap mapImage err:', err);
    }
  }

  componentDidMount() {
    this.readFloorImageList();
    //const initPoint = [14151045.684011811, 4507404.1843676185];
    let initPoint = [14117060.544502536, 4485257.858380006];
    
    const olmap = new OlMap({
      target: null,
      layers: [],
      view: new OlView({
        center: initPoint,
        zoom: 15,
        maxZoom: 18,
        minZoom: 12,
        //extent: [14109839.889583563, 4476606.537302538, 14127130.300806625, 4490059.690596272]
        //extent: [14148625.825044088, 4504641.403810109, 14153422.248568982, 4508926.654708347]
      })
    });

    // tile layer
    const layer = new OlTileLayer({
      source: new OlTileWMS({
        url: this.context.mapserver_url,
        //url: 'http://192.168.7.135:8080/geoserver/tiger/wms',
        params: { LAYERS: 'tiger:11111' },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
      })
    });
    olmap.addLayer(layer);
    olmap.setTarget(this.mapRef.current);

    let dblClkInter;
    olmap.getInteractions().getArray().forEach(interection => {
      // console.log('interaction:', interection);
      if (interection instanceof OlDoubleClickZoom){
        dblClkInter = interection;
      }
    });
    if (dblClkInter) {
      olmap.removeInteraction(dblClkInter);
    }

    this.animationStart = new Date().getTime();
    this.listenerKey = layer.on('postrender', this.animate);

    const styles = {
      ebell: new OlStyle({
        image: new OlIcon({
          anchor: [0.5, 0.5],
          src: require('../../assets/images/ebell.ico'),
        }),
        text: new OlText({
          font: 'bold 14px Calibri, sans-serif',
          overflow: true,
          offsetY: 30,
          fill: new OlFill({
            color: '#000',
          }),
          backgroundStroke: new OlStroke({
            color: '#bdbdbd'
          }),
          backgroundFill: new OlFill({
            color: '#ffb74d'
          }),
          padding: [3, 1, 1, 1]
        }),
      }),
      ebell_event: new OlStyle({
        image: new OlIcon({
          anchor: [0.5, 0.5],
          src: require('../../assets/images/ebell_event.ico'),
        }),
        text: new OlText({
          font: 'bold 14px Calibri,sans-serif',
          overflow: true,
          offsetY: 30,
          fill: new OlFill({
            color: '#000',
          }),
          backgroundStroke: new OlStroke({
            color: '#bdbdbd'
          }),
          backgroundFill: new OlFill({
            color: '#ffb74d'
          }),
          padding: [3, 1, 1, 1]
        }),
      }),
      building: new OlStyle({
        image: new OlIcon({
          anchor: [0.5, 0.5],
          src: require('../../assets/images/building.ico'),
        }),
        text: new OlText({
          font: 'bold 14px Calibri, sans-serif',
          overflow: true,
          offsetY: 30,
          fill: new OlFill({
            color: '#000',
          }),
          backgroundStroke: new OlStroke({
            color: '#bdbdbd'
          }),
          backgroundFill: new OlFill({
            color: '#ffb74d'
          }),
          padding: [3, 1, 1, 1]
        }),
      }),
      building_event: new OlStyle({
        image: new OlIcon({
          anchor: [0.5, 0.5],
          src: require('../../assets/images/building_event.ico'),
        }),
        text: new OlText({
          font: 'bold 14px Calibri, sans-serif',
          overflow: true,
          offsetY: 30,
          fill: new OlFill({
            color: '#000',
          }),
          backgroundStroke: new OlStroke({
            color: '#bdbdbd'
          }),
          backgroundFill: new OlFill({
            color: '#ffb74d'
          }),
          padding: [3, 1, 1, 1]
        }),
      }),
      camera: new OlStyle({
        image: new OlIcon({
          anchor: [0.5, 0.5],
          src: require('../../assets/images/cctv_bullet.ico'),
        }),
        text: new OlText({
          font: 'bold 14px Calibri, sans-serif',
          overflow: true,
          offsetY: 30,
          fill: new OlFill({
            color: '#000',
          }),
          backgroundStroke: new OlStroke({
            color: '#bdbdbd'
          }),
          backgroundFill: new OlFill({
            color: '#ffb74d'
          }),
          padding: [3, 1, 1, 1]
        }),
      }),
      camera_event: new OlStyle({
        image: new OlIcon({
          anchor: [0.5, 0.5],
          src: require('../../assets/images/cctv_bullet.ico'),
        }),
        text: new OlText({
          font: 'bold 14px Calibri, sans-serif',
          overflow: true,
          offsetY: 30,
          fill: new OlFill({
            color: '#000',
          }),
          backgroundStroke: new OlStroke({
            color: '#bdbdbd'
          }),
          backgroundFill: new OlFill({
            color: '#ffb74d'
          }),
          padding: [3, 1, 1, 1]
        }),
      }),
      guardianlite: new OlStyle({
        image: new OlIcon({
          anchor: [0.5, 0.5],
          src: require('../../assets/images/guardianlite.ico'),
        }),
        text: new OlText({
          font: 'bold 14px Calibri, sans-serif',
          overflow: true,
          offsetY: 30,
          fill: new OlFill({
            color: '#000',
          }),
          backgroundStroke: new OlStroke({
            color: '#bdbdbd'
          }),
          backgroundFill: new OlFill({
            color: '#ffb74d'
          }),
          padding: [3, 1, 1, 1]
        }),
      }),
    };

    const vectorLayer = new OlVectorLayer({
      source: new OlVectorSource({
        features: []
      }),
      style: function (feature, resolution) {
        if (feature.get('type') === 'building' || feature.get('type') === 'building_event') {
          styles[feature.get('type')].getImage().setScale((1 / Math.pow(resolution, 1 / 5)) * 0.9);
          styles[feature.get('type')].getText().setText(feature.get('name'));
        } else if (feature.get('type') === 'guardianlite') {
          styles[feature.get('type')].getImage().setScale((1 / Math.pow(resolution, 1 / 5)) * 0.9);
          styles[feature.get('type')].getText().setText(feature.get('name'));
        } else {
          styles[feature.get('type')].getImage().setScale((1 / Math.pow(resolution, 1 / 5)) * 0.9);
          styles[feature.get('type')].getText().setText(feature.get('name'));
        }
        return styles[feature.get('type')];
      }
    });
    olmap.addLayer(vectorLayer);
    this.setState({ vectorLayer: vectorLayer });

    // scale (축척)
    const scale = new ScaleLine({
      units: 'metric',      
      bar: false,
      text: true,
      minWidth: 125
    });
    olmap.addControl(scale);

    // contextmenu
    const contextmenuItems = [
      {
        text: '건물 추가',
        icon: require('../../assets/images/building_add.ico'),
        callback: this.handleShowBuildingModal
      },
      '-',
      {
        text: '카메라 추가',
        icon: require('../../assets/images/camera_add.ico'),
        callback: this.handleShowCameraModal
      },
      {
        text: '전원장치 추가',
        icon: require('../../assets/images/guardianlite_add.ico'),
        callback: this.handleShowGuardianModal
      }
    ];

    const contextmenuAddFloor = {
      text: '층 추가',
      icon: require('../../assets/images/floor_add.ico'),
      callback: this.handleShowFloorModal
    };
    
    const contextmenuModifyFloor = {
      text: '층 이름 수정',
      icon: require('../../assets/images/floor_update.ico'),
      callback: this.handleModifyFloorModal
    };
    
    const contextmenuRemoveFloor = {
      text: '층 삭제',
      icon: require('../../assets/images/floor_remove.ico'),
      callback: this.handleDelFloorModal
    };
    
    const contextmenuRemoveBuilding = {
      text: '건물 삭제',
      icon: require('../../assets/images/building_remove.ico'),
      callback: this.handleRemoveBuilding
    };
    
    const contextmenuModifyBuilding = {
      text: '건물 이름 수정',
      icon: require('../../assets/images/building_update.ico'),
      callback: this.handleModifyBuildingModal
    }
    
    const contextmenuRemoveItemGuardianlite = {
      text: '전원장치 삭제',
      icon: require('../../assets/images/guardianlite_remove.ico'),
      callback: this.handleRemoveGuardianlite
    };

    const contextmenuRemoveItemCamera = {
      text: '카메라 삭제',
      icon: require('../../assets/images/camera_remove.ico'),
      callback: this.handleRemoveCamera
    };

    const contextmenuAllEventConfirm = {
      text: '전체 이벤트 알람 해제',
      icon: require('../../assets/images/event_clear.ico'),
      callback: this.handleConfirmAllEvent
    };
    const contextmenuModifyItem = {
      text: '컨텍스트 메뉴(작업중)',
      icon: require('../../assets/images/context_bell_modify.png'),
      callback: this.handleContextMenu
    };

    const contextmenuModifyItemCamera = {
      text: '디바이스 수정',
      icon: require('../../assets/images/context_camera_modify.png'),
      callback: this.handleShowCameraModal
    };

    const contextmenuMoveLocationItem = {
      text: '컨텍스트 메뉴(작업중)',
      icon: require('../../assets/images/context_bell_location.png'),
      callback: this.handleContextMenu
    };

    const contextmenuMoveLocationItemCamera = {
      text: '디바이스 위치이동',
      icon: require('../../assets/images/context_bell_location.png'),
      callback: this.handleChangeMapModeModify
    };

    const contextmenu = new ContextMenu({
      width: 190,
      defaultItems: false,
      items: []
    });
    olmap.addControl(contextmenu);

    const contextElement = document.getElementsByClassName('ol-ctx-menu-container');

    contextmenu.on('beforeopen', (event) => {
      const feature = olmap.getFeaturesAtPixel(event.pixel)[0];

      if (feature) {
        console.log(`context marker selected: ${feature.get('name')}(${feature.getId()})`);
        this.selectedContextFeature = feature;
        contextmenu.clear();
        const rawFeatureId = feature.getId();
        const arrSplite = rawFeatureId.split(':');
        if (arrSplite.length > 2) {
          const featureType = arrSplite[1];
          const serviceType = arrSplite[2];
  
          if ((featureType === 'building' || featureType === 'building_event') && serviceType !== 'observer') {
            //contextmenu.disable();
            if (contextElement.length > 0) {
              contextElement[0].style.display = 'none';
            }            
          } else {
            contextElement[0].style.display = 'initial';
            contextmenu.enable();
          }
        }
      } else {
        contextElement[0].style.display = 'initial';
        contextmenu.enable();
      }
    });

    contextmenu.on('open', (event) => {
      if (!event) return;
      const coordinate = event.coordinate;
      console.log(`OSM좌표-경도(longi):${coordinate[0]}-위도(latit):${coordinate[1]}`);
      const epsg4326 = transform([coordinate[0], coordinate[1]], 'EPSG:3857', 'EPSG:4326');
      console.log(`지도좌표-경도(longi):${epsg4326[0]}-위도(latit):${epsg4326[1]}`);
      // const epsg3857 = transform([epsg4326[0], epsg4326[1]], 'EPSG:4326', 'EPSG:3857');
      // console.log(`변환좌표-경도(longi):${epsg3857[0]}-위도(latit):${epsg3857[1]}`);

      // if (this.state.mapMode === 'modify') {
      //   contextmenu.close();
      //   return;
      // }

      //const feature = olmap.forEachFeatureAtPixel(event.pixel, ft => ft);
      const feature = olmap.getFeaturesAtPixel(event.pixel)[0];

      if (feature) {
        console.log(`context marker selected: ${feature.get('name')}(${feature.getId()})`);
        this.selectedContextFeature = feature;
        contextmenu.clear();
        const rawFeatureId = feature.getId();
        const arrSplite = rawFeatureId.split(':');
        const featureType = arrSplite[1];
        const serviceType = arrSplite[2];

        if ((featureType === 'building' || featureType === 'building_event') && serviceType === 'observer') {
          contextmenuAddFloor.data = { marker: feature };
          contextmenuRemoveBuilding.data = { marker: feature };
          contextmenuRemoveFloor.data = { marker: feature };
          contextmenu.push(contextmenuAddFloor);
          contextmenu.push(contextmenuModifyFloor)
          contextmenu.push(contextmenuRemoveFloor);          
          contextmenu.push('-');
          contextmenu.push(contextmenuModifyBuilding);
          contextmenu.push(contextmenuRemoveBuilding);
          // contextmenu.push(contextmenuAddFloor);
        } else if ((featureType === 'camera' || featureType === 'camera_event') && serviceType === 'observer') {          
          contextmenuRemoveItemCamera.data = { marker: feature };
          contextmenuAllEventConfirm.data = { marker: feature };
          contextmenu.push(contextmenuRemoveItemCamera);
          contextmenu.push(contextmenuAllEventConfirm);     
          // contextmenu.push(contextmenuAddFloor);
          if(feature.getId() === (this.state.selectedFeature && this.state.selectedFeature.getId())){
            overlay.setPosition(undefined);
          }
        } else if (featureType === 'guardianlite' && serviceType === 'observer') {          
          contextmenuRemoveItemGuardianlite.data = { marker: feature };
          contextmenuAllEventConfirm.data = { marker: feature };
          contextmenu.push(contextmenuRemoveItemGuardianlite);
          contextmenu.push(contextmenuAllEventConfirm); 
          // contextmenu.push('-');
          // contextmenu.push(contextmenuRemoveItemGuardianlite);
          if(feature.getId() === (this.state.selectedFeature3 && this.state.selectedFeature3.getId())){
            overlayGrdlte.setPosition(undefined);
          }
        } else if(featureType === 'ebell' ) {
          contextmenuAllEventConfirm.data = { marker: feature };
          contextmenu.push(contextmenuAllEventConfirm);
          if(feature.getId() === (this.state.selectedFeature2 && this.state.selectedFeature2.getId())){
            overlay2.setPosition(undefined);
          }
        } else {
          // contextmenuModifyItem.data = { marker: feature };
          // contextmenu.push(contextmenuModifyItem);
          // contextmenuMoveLocationItem.data = { marker: feature };
          // contextmenu.push(contextmenuMoveLocationItem);
          // contextmenu.push('-');
          // contextmenuRemoveItem.data = { marker: feature };
          // contextmenu.push(contextmenuRemoveItem);
          this.selectedContextFeature = undefined;
          this.setState({ clickPoint: [epsg4326[0], epsg4326[1]] });
          //contextmenu.clear();
          //contextmenu.extend(contextmenuItems);
        }
        
        // jjh - test
        this.setState({ testFeatureId: feature.getId() })
        this.setState({ testFeatureName: feature.get('name') })
      } else {
        this.selectedContextFeature = undefined;
        this.setState({ clickPoint: [epsg4326[0], epsg4326[1]] });
        contextmenu.clear();
        contextmenu.extend(contextmenuItems);
        const menu = document.getElementsByClassName('ol-ctx-menu-container');
        for(let i = 0; i < menu.length; i++) {
          menu[i].classList.add('active');
        }
      }
    });

    // mouse control
    const mousePosition = new OlMousePosition({
      coordinateFormat: new createStringXY(8),
      projection: 'EPSG:4326',
      className: 'mposition',
      target: document.getElementById('mouseCoordinate'),
      undefinedHTML: '&nbsp;',
    });
    olmap.addControl(mousePosition);

    const container = document.getElementById('popup');
    const closer = document.getElementById('popup-closer');
    const camera_video = document.getElementById('popup-video');
    
    let overlay = new Overlay({
      element: container,
      autoPan: true,
      offset: [0, -15],
      autoPanAnimation: {
        duration: 250
      },
      className: 'm1 ol ol-overlay-container ol-selectable'
    });

    closer.onclick = (e) => {
      e.preventDefault();
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    olmap.addOverlay(overlay);

    const ebell_container = document.getElementById('ebell-popup');
    const ebell_closer = document.getElementById('ebell-popup-closer');
    const ebell_video = document.getElementById('ebell-popup-video');

    let overlay2 = new Overlay({
      element: ebell_container,
      autoPan: true,
      offset: [0, -15],
      autoPanAnimation: {
        duration: 250
      },
      className: 'm2 ol ol-overlay-container ol-selectable'
    });

    ebell_closer.onclick = (e) => {
      e.preventDefault();
      overlay2.setPosition(undefined);
      closer.blur();
      return false;
    };

    olmap.addOverlay(overlay2);

    // guardian lite overlay
    const containerGrdlte = document.getElementById('guardianlite');
    const closerGrdlte = document.getElementById('guardianlite-closer')

    let overlayGrdlte = new Overlay({
      element: containerGrdlte,
      autoPan: true,
      offset: [0, -30],
      autoPanAnimation: {
        duration: 250
      },
      className: 'm3 ol ol-overlay-container ol-selectable'
    });

    closerGrdlte.onclick = (e) => {
      e.preventDefault();
      overlayGrdlte.setPosition(undefined);
      this.setState({ currGuardianlite: '' });
      closerGrdlte.blur();
      return false;
    };

    olmap.addOverlay(overlayGrdlte);

    // map event
    olmap.on('click', async (event) => {
      document.querySelectorAll(".ol").forEach(function(el){ 
        el.classList.remove('active');
      });
      const coordinate = event.coordinate;
      console.log(`OSM좌표-경도(longi):${coordinate[0]}-위도(latit):${coordinate[1]}`);
      const epsg4326 = transform([coordinate[0], coordinate[1]], 'EPSG:3857', 'EPSG:4326');
      console.log(`지도좌표-경도(longi):${epsg4326[0]}-위도(latit):${epsg4326[1]}`);
      // const epsg3857 = transform([epsg4326[0], epsg4326[1]], 'EPSG:4326', 'EPSG:3857');
      // console.log(`변환좌표-경도(longi):${epsg3857[0]}-위도(latit):${epsg3857[1]}`);

      //현재 지도의 extent 구하기
      // const size = this.state.map.getSize();
      // const extent = this.state.map.getView().calculateExtent(size);
      // console.log('extent:', extent);

      //contextmenu.close();

      this.selectedContextFeature = undefined;
      if (olmap.hasFeatureAtPixel(event.pixel) === true) {

        console.log('마커 클릭');

        const feature = olmap.getFeaturesAtPixel(event.pixel)[0];
        if (feature) {
          console.log('클릭된마커:', feature.getId());
          console.log(feature);
          const featureType = feature.get('type');
          const featureId_ServiceType = feature.getId();
          let featureId;
          const splitArr = featureId_ServiceType.split(':');
          if (splitArr.length>1){
            featureId = splitArr[0];
          }
          const featureServiceType = feature.get('serviceType');
          if (feature.get('type') === 'camera' || feature.get('type') === 'camera_event') {
            document.querySelector('.m1').classList.add('active');
            this.setState({ selectedFeature: feature });
            this.props.readEventsByIpForWeek(feature ? (feature.get('ipaddress') ? feature.get('ipaddress') : null) : null)
            const camera = this.props.cameraList.find((camera) => camera.cameraid === featureId);
            if(camera) {
              try {
                const res = await axios(`/api/observer/getcameralivestreamurl?id=${camera.cameraid}`);
                console.log('res확인: ', res);
                if (res && res.data && res.data.result) {
                  console.log('camera_video 확인: ', camera_video)
                  this.setState({ cameraPopup: 'ol-popup'});
                  camera_video.innerHTML = `<img style="width: 240px; height: 180px;" src="${res.data.result}" autoplay></img>`;
                } else {
                  this.setState({ videoPresence: false });
                  this.setState({ cameraPopup: 'ol-popup noVideo'});
                  camera_video.innerHTML = null;
                }
              } catch (err) {
                console.log('getlivestream error:', err);
                this.setState({ videoPresence: false });
                this.setState({ cameraPopup: 'ol-popup noVideo'});
                camera_video.innerHTML = null;
              }
            }
            overlay.setPosition(feature.getGeometry().getCoordinates());
          } else if(feature.get('type') === 'ebell' || feature.get('type') === 'ebell_event') {
            document.querySelector('.m2').classList.add('active');
            this.setState({ selectedFeature2: feature });
            this.props.readEventsByIpForWeek(feature ? (feature.get('ipaddress') ? feature.get('ipaddress') : null) : null)
            const camera = this.props.cameraList.find((camera) => camera.cameraid === feature.get('camera_id'));
            if(camera) {
              try {
                const res = await axios(`/api/observer/getcameralivestreamurl?id=${camera.cameraid}`);
                console.log('res확인: ', res);
                if (res && res.data && res.data.result) {
                  this.setState({ ebellPopup: "ol-ebell-popup"});
                  ebell_video.innerHTML = `<img style="width: 240px; height: 180px;" src="${res.data.result}" autoplay></img>`;
                } else {
                  this.setState({ ebellPopup: "ol-ebell-popup noVideo"});
                  ebell_video.innerHTML = null;
                }
              } catch (err) {
                console.log('getlivestream error:', err);
                this.setState({ ebellPopup: "ol-ebell-popup noVideo"});
                ebell_video.innerHTML = null;
              }
            } else {
              this.setState({ ebellPopup: "ol-ebell-popup noVideo"});
              ebell_video.innerHTML = null;
            }
            overlay2.setPosition(feature.getGeometry().getCoordinates());
          }
          console.log(`[실외지도 아이콘선택] type:${featureType}, id:${featureId}, serviceType:${featureServiceType}`);
          if ((featureType === 'building' || featureType === 'building_event') && featureId && featureServiceType) {
            const floor = this.props.floorList.find(floor => floor.building_idx === parseInt(featureId) && floor.service_type === featureServiceType);
            if (floor) {
              this.props.changeMapType(2, featureId, floor.idx, featureServiceType);
            } else {
              console.log('건물에 층이 없습니다.');
            }
          } else if (featureType === 'guardianlite' && featureId && featureServiceType) {
            document.querySelector('.m3').classList.add('active');
            this.setState({ selectedFeature3: feature });
            const overlays = olmap.getOverlays().getArray();
            if (overlays && overlays.length > 1) {
              const guardianlite = this.props.guardianliteList.find(grdlte => grdlte.name === feature.get('name'));
              if (guardianlite) {
                this.setState({
                  currGuardianlite: feature.get('name'),
                  guardianliteCh1: guardianlite.ch1,
                  guardianliteCh2: guardianlite.ch2,
                  guardianliteCh3: guardianlite.ch3,
                  guardianliteCh4: guardianlite.ch4,
                  guardianliteCh5: guardianlite.ch5,
                  guardianliteCh6: guardianlite.ch6,
                  guardianliteCh7: guardianlite.ch7,
                  guardianliteCh8: guardianlite.ch8,
                  guardianliteTemper: guardianlite.temper,
                }, ()=> {
                  overlays[2].setPosition(feature.getGeometry().getCoordinates());
                });
              } else {
                console.log('=> find guardianlite fail', this.props.guardianlite);
              }
              
            }
          }

          // const cameraInfo = this.state.cameraList.filter((camera) => camera.idx === parseInt(feature.get('camera_id')));
          // if(cameraInfo && cameraInfo.length > 0){
          //   const camera = cameraInfo[0];
          //   console.log(camera);            
          //   video.innerHTML = `<video style="width: 320px; height: 240px;" src="http://${camera.id}:${camera.password}@${camera.mgist_ip}:${camera.mgist_port}/live/media/${camera.video_access_point}?format=mp4" autoplay></video>`
          //   this.setState({ videoPresence: true});
          // } else {
          //   video.innerHTML = ``;
          //   this.setState({ videoPresence: false });
          // }

          // if (this.state.mapMode === 'modify') {
          //   this.translate = new OlTranslate({
          //     features: new OlCollection([feature])
          //   });
          //   olmap.addInteraction(this.translate);
          //   this.translate.on('translatestart', (evt) => {
          //     console.log('translate:', evt);
          //   });
          //   this.translate.on('translating', (evt) => {
          //     console.log('translating', evt);
          //   });
          //   this.translate.on('translateend', (evt) => {
          //     console.log('translateend', evt);
          //     olmap.removeInteraction(this.translate);
          //   });
          //  } else {
          // }
        }
      } else {
        // overlay.setPosition(undefined);
        // overlay2.setPosition(undefined);
        // overlayGrdlte.setPosition(undefined);
      }
    });

    olmap.on('pointermove', (evt) => {
      // mouse cursor : 'pointer'-클릭가능손모양, 'crosshair'-얇은십자가, 'move'-네방향화상표
      //olmap.getViewport().style.cursor = 'crosshair';
      //olmap.getViewport().style.cursor = 'move';
      //olmap.getViewport().style.cursor = '';
    });

    this.setState({ map: olmap });
  }

  getBuildingFloorList = async (testFeatureId) => {
    const testFeatureArr = testFeatureId.split(":");
    const buildingIdx = testFeatureArr[0];
    const res = await axios.get('/api/observer/findFloor', {
      params: {
        buildingIdx: buildingIdx
      }
    })
    console.log(res);
    this.setState({
      buildingFloorList: res.data.result
    })
  }

  static getDerivedStateFromProps(props, state) {
    if (state.map) {
      // marker
      const markerArr = [];
      if (props.buildingList) {
        props.buildingList.map((building) => {
          const epsg3857 = transform([building.longitude, building.latitude], 'EPSG:4326', 'EPSG:3857');
          const marker = new Feature({
            type: 'building',
            name: building.name,
            serviceType: building.service_type,
            eventStatus: building.status,
            geometry: new Point([epsg3857[0], epsg3857[1]]),
          })
          marker.setId(building.idx + ":" + 'building' + ':' + building.service_type);
          markerArr.push(marker);
          return building;
        });
      }
      if (props.deviceList) {
        props.deviceList.map((device) => {
          if (device.floor_idx === 0 && device.type === 'ebell') {
            const epsg3857 = transform([device.longitude, device.latitude], 'EPSG:4326', 'EPSG:3857');
            const marker = new Feature({
              type: 'ebell',
              name: device.name,
              idx: device.idx,
              buildingName: device.buildingname,
              floorName: device.floorname,
              device_id: device.id,
              eventStatus: device.status,
              location: device.location,
              ipaddress: device.ipaddress,
              serviceType: device.service_type,
              camera_id: device.camera_id,
              geometry: new Point([epsg3857[0], epsg3857[1]]),
            })
            marker.setId(device.id + ":" + device.type + ':' + device.service_type);
            markerArr.push(marker);
          } else if (device.floor_idx === 0 && device.type === 'guardianlite') {
            const epsg3857 = transform([device.longitude, device.latitude], 'EPSG:4326', 'EPSG:3857');
            const marker = new Feature({
              type: 'guardianlite',
              name: device.name,
              idx: device.idx,
              device_id: device.idx,
              ipaddress: device.ipaddress,
              serviceType: device.service_type,
              geometry: new Point([epsg3857[0], epsg3857[1]]),
            })
            marker.setId(device.idx + ":" + device.type + ":" + device.service_type);
            markerArr.push(marker);
          }
          return device;
        });
      }
      if (props.cameraList) {
        props.cameraList.map((camera) => {
          if ((camera.floor_idx === 0 || camera.floor_idx === null) && camera.longitude && camera.latitude) {
            const epsg3857 = transform([camera.longitude, camera.latitude], 'EPSG:4326', 'EPSG:3857');
            const marker = new Feature({
              type: 'camera',
              camera_id: camera.cameraid,
              buildingName: camera.buildingname,
              floorName: camera.floorname,
              device_id: camera.cameraid,
              eventStatus: camera.status,
              name: camera.cameraid + '.' +camera.cameraname,
              ipaddress: camera.ipaddress,
              serviceType: camera.service_type,
              geometry: new Point([epsg3857[0], epsg3857[1]]),
            })
            marker.setId(camera.cameraid + ':' + 'camera' + ':' + 'observer');
            markerArr.push(marker);
          }
          return camera;
        });
      }

      if (state.vectorLayer) {
        // console.log('markerArr:', markerArr);
        state.vectorLayer.setSource(
          new OlVectorSource({
            features: markerArr
          })
        );
      }
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.moveToFeature.timestamp !== prevProps.moveToFeature.timestamp) {
      if (this.state.vectorLayer) {
        const source = this.state.vectorLayer.getSource();
        const features = source.getFeatures();
        const featuresFilter = features.filter(feature => feature.getId() === (this.props.moveToFeature.deviceId + ':' + this.props.moveToFeature.deviceType + ':' + this.props.moveToFeature.buildingServiceType));
        if (featuresFilter.length > 0) {
          if (this.state.map) {
            const view = this.state.map.getView();
            if (view) {
              view.animate({ zoom: 16, center: featuresFilter[0].getGeometry().getCoordinates() });
            }
          }
        }
      }
    }
    if (this.props.guardianliteList !== prevProps.guardianliteList) {
      const guardianlite = this.props.guardianliteList.find(grdlte => grdlte.name === this.state.currGuardianlite);
      if (guardianlite) {
        this.setState({
          guardianliteCh1: guardianlite.ch1,
          guardianliteCh2: guardianlite.ch2,
          guardianliteCh3: guardianlite.ch3,
          guardianliteCh4: guardianlite.ch4,
          guardianliteCh5: guardianlite.ch5,
          guardianliteCh6: guardianlite.ch6,
          guardianliteCh7: guardianlite.ch7,
          guardianliteCh8: guardianlite.ch8,
          guardianliteTemper: guardianlite.temper,
        });
      }
    }
  }

  handleShowCameraModal = async (obj) => {
    console.log('test -----', obj);
    // obj.data 가 있으면 수정팝업
    if (obj && obj.data) {
      const feature = obj.data.marker;
      if (feature && feature.getId()) {
        for (let item of this.state.cameraList) {
          if (item.id === feature.getId()) {
            this.setState({
              showCameraModal: !this.state.showCameraModal,
              modalCurrentCamera: item.id,
              modalCameraLatitude: item.latitude,
              modalCameraLongitude: item.longitude,
              modalCameraWarn: '',
            });
            break;
          }
        }
      }
    } else {
      this.setState({
        showCameraModal: !this.state.showCameraModal,
        modalCameraLatitude: '',
        modalCameraLongitude: '',
        modalCameraWarn: '',
        modalCurrentCamera: undefined,
      });
    }

    //this.props.changeMapMode('normal');
    this.state.map.getViewport().style.cursor = '';
  };

  handleShowGuardianModal = async () => {
    this.setState({
      showGuardianModal: !this.state.showGuardianModal,
      modalGuardianName: '',
      modalGuardianIpaddress: '',
      modalGuardianLatitude: '',
      modalGuardianLongitude: '',
      modalGuardianWarn: '',
    });
  }

  handleShowBuildingModal = async (obj) => {
    // obj.data 가 있으면 수정팝업
    if (obj && obj.data) {
      const feature = obj.data.marker;
      if (feature && feature.getId()) {
        for (let item of this.state.buildingList) {
          if (item.idx === feature.getId()) {
            this.setState({
              showBuildingModal: !this.state.showBuildingModal,
              modalBuildingLatitude: item.latitude,
              modalBuildingLongitude: item.longitude,
              modalBuildingWarn: '',
              modalCurrentBuilding: item.idx
            });
            break;
          }
        }
      }
    } else {
      this.setState({
        showBuildingModal: !this.state.showBuildingModal,
        modalBuildingLatitude: '',
        modalBuildingLongitude: '',
        modalBuildingWarn: '',
        modalCurrentBuilding: undefined,
      });
    }

    //this.props.changeMapMode('normal');
    this.state.map.getViewport().style.cursor = '';
  };
  // ----> obj -> building 정보 parameter



  handleShowFloorModal = async () => {
    this.setState({
      showFloorModal: !this.state.showFloorModal,
      modalFloorLatitude: '',
      modalFloorLongitude: '',
      modalFloorWarn: '',
      modalCurrentFloor: undefined,
      modalGroupImageId: ''
    });
  };

  handleModifyFloorModal = async () => {
    this.setState({
      showFloorModifyModal: !this.state.showFloorModifyModal,
      modalFloorWarn: '',
      modalCurrentFloor: undefined,
      modalGroupImageId: '',
      modalmodifyFloor: ''
    });
  }
  
  handleDelFloorModal = async () => {
    this.setState({
      delFloorModal: !this.state.delFloorModal,
      modalFloorLatitude: '',
      modalFloorLongitude: '',
      modalFloorWarn: '',
      modalCurrentFloor: undefined,
      modalGroupImageId: ''
    });
  };
  
  handleModifyBuildingModal = async () => {
    this.setState({
      showBuildingModifyModal: !this.state.showBuildingModifyModal,
      modalBuildingWarn: '',
      modalmodifyBuilding: ''
    });
  }
  
  handleContextMenu = (obj) => {
    if (obj) {
      console.log('obj:', obj);
    }
  }

  getCameraId = (idx) => {
    const cameraInfo = this.props.cameraList.filter((camera) => camera.idx === parseInt(idx));
    if (cameraInfo && cameraInfo.length > 0) {
      const camera = cameraInfo[0];
      return camera.display_id + '.' + camera.display_name;
    }
  }

  validateIpaddress = async (ip) => {
    const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (ipformat.test(ip)) {
      return true;
    } else {
      return false;
    }
  }

  handleRemoveCamera = async (obj) => {
    
    try {
      if (obj && obj.data) {
        const feature = obj.data.marker;
        if (feature && feature.getId()) {
          const rawId = feature.getId();
          console.log('raw id:', rawId);
          const arrRawId = rawId.split(':');
          
          if (arrRawId.length > 2) {
            const id = arrRawId[0];
            const name = feature.get('name');
            const service_type = arrRawId[2];

            this.setState({
              showDelConfirm: true,
              modalConfirmTitle: '카메라 삭제',
              modalConfirmMessage: '[ ' + name + ' ] 카메라를 삭제하시겠습니까?',
              modalConfirmBtnText: '삭제',
              modalConfirmCancelBtnText: '취소',
              modalConfirmIdx: id,
              modalConfirmServiceType: service_type,
            });
          }
        }
      }
    } catch(err) {
      console.log('handleRemoveCamera:', err);
    }
  }

  handleRemoveGuardianlite = async (obj) => {
    console.log(obj);
    try {
      if (obj && obj.data) {
        const feature = obj.data.marker;
        if (feature && feature.getId()) {
          const rawId = feature.getId();
          console.log('raw id:', rawId);
          const arrRawId = rawId.split(':');
          
          if (arrRawId.length > 2) {
            const idx = arrRawId[0];
            const name = feature.get('name');
            const service_type = arrRawId[2];

            this.setState({
              showDelConfirm: true,
              modalConfirmTitle: '전원장치 삭제',
              modalConfirmMessage: '[ ' + name + ' ] 전원장치를 삭제하시겠습니까?',
              modalConfirmBtnText: '삭제',
              modalConfirmCancelBtnText: '취소',
              modalConfirmIdx: idx,
              modalConfirmServiceType: service_type,
            });

            // // 가디언라이트 장치삭제 REST API 호출
            // const res = await axios.delete('/api/observer/guardianlite', {
            //   params: {
            //     idx,
            //     service_type
            //   }
            // });
            //console.log('del guardianlite:', res);
          }
        }
      }
    } catch(err) {
      console.log('handleRemoveGuardianlite:', err);
    }
  }

  handleAddGuardianlite = async (e) => {
    e.preventDefault();
    const duplicateGuradian = this.props.deviceList.find((device) => device.ipaddress === this.state.modalGuardianIpaddress);
    if(duplicateGuradian){
      this.setState({ modalGuardianWarn: '*동일한 IP의 가디언라이트가 있습니다.' });
      return
    }
    // 입력값 검사
    if (this.state.modalGuardianName === undefined ||
      this.state.modalGuardianName === null ||
      this.state.modalGuardianName.length === 0) {
        this.setState({ modalGuardianWarn: '*전원장치 이름을 입력하세요.'});
        return
    } else if (this.state.modalGuardianName.length > 30) {
      this.setState({ modalGuardianWarn: '*전원장치 이름은 최대 30자 입니다.'});
      return
    } else if (this.state.modalGuardianIpaddress === undefined ||
      this.state.modalGuardianIpaddress === null ||
      this.state.modalGuardianIpaddress.length === 0) {
        this.setState({ modalGuardianWarn: '*전원장치 IP Address를 입력하세요.'});
        return
    } else if (await this.validateIpaddress(this.state.modalGuardianIpaddress) === false) {
      this.setState({ modalGuardianWarn: '*잘못된 IP Address 형식입니다.'});
      return
    }

    try {
      // 가디언라이트 장치추가 REST API 호출
      const res = await axios.post('/api/observer/guardianlite', {
        name: this.state.modalGuardianName,
        ipaddress: this.state.modalGuardianIpaddress,
        building_idx: 0,
        building_service_type: 'observer',
        floor_idx: 0,
        longitude: this.state.clickPoint[0],
        latitude: this.state.clickPoint[1],
      });
      console.log('add guardianlite:', res);
      this.props.readGuardianliteList();

    } catch(err) {
      console.log('handleAddGuardianlite:', err);
    } finally {
      this.setState({
        showGuardianModal: !this.state.showGuardianModal,
        modalGuardianName: '',
        modalGuardianIpaddress: '',
        modalGuardianWarn: '',
      });
    }
  }

  handleGuardianliteSetBtn = async (e, ch, cmd) => {
    e.preventDefault();
    const channel = parseInt(ch);    
    if (channel >=1 && channel <= 8 && (cmd === 'reset' || cmd === 'on' || cmd === 'off')){
      try {
        // 가디언라이트 전원 on/off 설정 rest api 호출
        const grdlte = this.props.guardianliteList.find(gl => gl.name === this.state.currGuardianlite);
        if (grdlte) {
          if (grdlte.ipaddress) {
            const res = await axios.put('/api/observer/guardianlitechannel', {
              ipaddress: grdlte.ipaddress,
              channel: ch,
              cmd: cmd,
            });
            console.log('set guardianlite on/off:', res);
            this.props.readGuardianliteList();
          }
        }
      } catch(err) {
        console.log('handleGuardianliteSetBtn', err);
      }
    }
  }

  handleAddMapCamera = async (e) => {
    e.preventDefault();
    if (this.state.modalCurrentCamera === undefined) {
      this.setState({ modalCameraWarn: '*장치를 선택하세요.' });
      return
    }

    try {
      const res = await axios.put('/api/observer/addLocation', {
        id: this.state.modalCurrentCamera,
        longitude: this.state.clickPoint[0].toString(),
        latitude: this.state.clickPoint[1].toString(),
        floorIdx: 0,
        buildingIdx: 0,
        buildingServiceType: 'observer',
      });

      console.log('put device:', res);
    } catch (err) {
      console.error(err);
      return;
    }

    this.setState({
      showCameraModal: false,
      modalCameraLatitude: '',
      modalCameraLongitude: '',
      modalCameraWarn: '',
      modalCurrentCamera: undefined,
    });
    //this.props.changeMapMode('normal');
  }

  handleAddMapBuilding = async (e) => {
    const checkDuplicateBuilding = this.props.buildingList.find((building) => building.name === this.state.modalCurrentBuilding)
    if(checkDuplicateBuilding){
      this.setState({ modalBuildingWarn: '*동일한 이름의 건물이 있습니다.' });
      return
    }
    if (this.state.modalCurrentBuilding === undefined) {
      this.setState({ modalBuildingWarn: '*건물 이름을 입력하세요.' });
      return
    }
    if(this.state.modalCurrentBuilding && this.state.modalCurrentBuilding.length >= 31){
      this.setState({ modalBuildingWarn: '*건물이름 글자수 제한을 초과했습니다.(30자 이내)' });
      return
    }
    
    try {
      const res = await axios.post('/api/observer/addBuilding', {
        name: this.state.modalCurrentBuilding,
        longitude: this.state.clickPoint[0],
        latitude: this.state.clickPoint[1],
        service_type: 'observer'
      });
    } catch (err) {
      console.error(err);
      return;
    }

    this.setState({
      showBuildingModal: false,
      modalBuildingLatitude: '',
      modalBuildingLongitude: '',
      modalBuildingWarn: '',
      modalServiceType: undefined,
      modalCurrentBuilding: undefined,
    });
  }

  handleModifyBuilding = async () => {
    if (this.state.modalmodifyBuilding === undefined || this.state.modalmodifyBuilding === '') {
      this.setState({ modalBuildingWarn: '*건물 이름을 입력하세요.' });
      return
    }
    if (this.state.modalmodifyBuilding && this.state.modalmodifyBuilding.length > 10) {
      this.setState({ modalBuildingWarn: '*건물 이름 글자수 제한을 초과했습니다. (10자 이내)' });
      return
    }
    if (this.state.modalmodifyBuilding === this.state.testFeatureName) {
      this.setState({ modalBuildingWarn: '*현재 건물 이름과 동일합니다.' });
      return
    }
    try {
      const testFeatureArr = this.state.testFeatureId.split(":");
      const checkDuplicateBuilding = this.props.buildingList.find((building) => building.name === this.state.modalmodifyBuilding);
      if (checkDuplicateBuilding) {
          this.setState({ modalBuildingWarn: '*동일한 이름의 건물이 있습니다.' });
          return
      }
      if (testFeatureArr.length < 2 || testFeatureArr[0] === undefined || testFeatureArr[1] === undefined || testFeatureArr[2] === undefined) {
        this.setState({ modalBuildingWarn: '*오류 발생' });
        return
      }
      const res = await axios.put('/api/observer/building', {
        name: this.state.testFeatureName,
        service_type: 'observer',
        modifyName: this.state.modalmodifyBuilding
      });
      console.log('insert Building = ', res);
    } catch (err) {
      console.error(err);
      return;
    }

    this.setState({
      testFeatureName: '',
      showBuildingModifyModal: false,
      modalBuildingWarn: '',
      modalServiceType: undefined,
      modalCurrentBuilding: undefined,
      modalmodifyBuilding: '',
    });
  }

  handleRemoveBuilding = async (obj) => {
    console.log(obj);
    try {
      if (obj && obj.data) {
        const feature = obj.data.marker;
        if (feature && feature.getId()) {
          const rawId = feature.getId();
          console.log('raw id:', rawId);
          const arrRawId = rawId.split(':');
          
          if (arrRawId.length > 2) {
            const idx = arrRawId[0];
            const name = feature.get('name');
            const service_type = arrRawId[2];
            this.setState({
              showDelConfirm: true,
              modalConfirmTitle: '건물 삭제',
              modalConfirmMessage: '[ ' + name + ' ] 건물을 삭제하시겠습니까?',
              modalConfirmBtnText: '삭제',
              modalConfirmCancelBtnText: '취소',
              modalConfirmIdx: idx,
              modalConfirmServiceType: service_type,
            });
          }
        }
      }
    } catch(err) {
      console.log('handleRemoveBuilding:', err);
    }
  }


  handleAddMapFloor = async (e) => {
    if (this.state.modalCurrentFloor === undefined || this.state.modalCurrentFloor === '') {
      this.setState({ modalFloorWarn: '*층 이름을 입력하세요.' });
      return
    }
    if (this.state.modalGroupImageId === undefined || this.state.modalGroupImageId === '') {
      this.setState({ modalFloorWarn: '*층 이미지를 선택하세요.' });
      return
    }
    if (this.state.modalCurrentFloor && this.state.modalCurrentFloor.length > 10) {
      this.setState({ modalFloorWarn: '*층이름 글자수 제한을 초과했습니다. (10자 이내)' });
      return
    }
    try {
      const testFeatureArr = this.state.testFeatureId.split(":");
      const buildingIdx = parseInt(testFeatureArr[0]);
      const checkDuplicateFloor = this.props.floorList.find((floor) => floor.name === this.state.modalCurrentFloor); 
      if (checkDuplicateFloor) {
        if (buildingIdx === checkDuplicateFloor.building_idx) {
          this.setState({ modalFloorWarn: '*동일한 이름의 층이 있습니다.' });
          return
        }
      }
      if(testFeatureArr.length < 2 || testFeatureArr[0] === undefined || testFeatureArr[1] === undefined || testFeatureArr[2] === undefined){
        this.setState({ modalFloorWarn: '*오류 발생' });
        return
      }
      const res = await axios.post('/api/observer/addFloor', {
        name: this.state.modalCurrentFloor,
        buildingIdx: testFeatureArr[0],
        mapImage: this.state.modalGroupImageId,
        service_type: 'observer'
      });
      console.log('insert Floor = ', res);
    } catch (err) {
      console.error(err);
      return;
    }

    this.setState({
      testFeatureId: '',
      showFloorModal: false,
      modalFloorLatitude: '',
      modalFloorLongitude: '',
      modalFloorWarn: '',
      modalServiceType: undefined,
      modalCurrentFloor: undefined,
      modalGroupImageId: '',
    });
    //this.props.changeMapMode('normal');
  }

  handleModifyFloor = async () => {
    if (this.state.modalGroupImageId === undefined || this.state.modalGroupImageId === '') {
      this.setState({ modalFloorWarn: '*층을 선택하세요.' });
      return
    }
    if (this.state.modalmodifyFloor === undefined || this.state.modalmodifyFloor === '') {
      this.setState({ modalFloorWarn: '*층 이름을 입력하세요.' });
      return
    }
    if (this.state.modalmodifyFloor && this.state.modalmodifyFloor.length > 10) {
      this.setState({ modalFloorWarn: '*층이름 글자수 제한을 초과했습니다. (10자 이내)' });
      return
    }
    if (this.state.modalmodifyFloor === this.state.modalGroupImageId) {
      this.setState({ modalFloorWarn: '*현재 층 이름과 동일합니다.' });
      return
    }

    try {
      const testFeatureArr = this.state.testFeatureId.split(":");
      const buildingIdx = parseInt(testFeatureArr[0]);
      const checkDuplicateFloor = this.props.floorList.find((floor) => floor.name === this.state.modalmodifyFloor); 
      if (checkDuplicateFloor) {
        if (buildingIdx === checkDuplicateFloor.building_idx) {
          this.setState({ modalFloorWarn: '*동일한 이름의 층이 있습니다.' });
          return
        }
      }
      if(testFeatureArr.length < 2 || testFeatureArr[0] === undefined || testFeatureArr[1] === undefined || testFeatureArr[2] === undefined){
        this.setState({ modalFloorWarn: '*오류 발생' });
        return
      }
      const res = await axios.put('/api/observer/floor', {
        name: this.state.modalGroupImageId,
        buildingIdx: testFeatureArr[0],
        service_type: 'observer',
        modifyName: this.state.modalmodifyFloor
      });
      console.log('insert Floor = ', res);
    } catch (err) {
      console.error(err);
      return;
    }

    this.setState({
      testFeatureId: '',
      showFloorModifyModal: false,
      modalFloorWarn: '',
      modalServiceType: undefined,
      modalCurrentFloor: undefined,
      modalGroupImageId: '',
      modalmodifyFloor: '',
    });
  }
  
  handleRemoveFloor= async (selectFloor) => {
    const featureParseInt = this.state.testFeatureId.split(":")[0];
    const featureId = parseInt(featureParseInt);
    const featureServiceType = this.state.testFeatureId.split(":")[2];
    const floorName = this.state.modalGroupImageId;
    if(floorName && floorName.length > 0){
      this.setState({
        showDelConfirm: true,
        modalConfirmTitle: '층 삭제',
        modalConfirmMessage: '선택한 층을 삭제하시겠습니까?',
        modalConfirmBtnText: '삭제',
        modalConfirmCancelBtnText: '취소',
        modalConfirmIdx: featureId,
        modalConfirmServiceType: featureServiceType,
        modalConfirmFloorName: floorName
      });
    }
    else {
      this.setState({
        modalFloorWarn: '층을 선택하세요.'
      });
      return
    }
  }

  handleConfirmAllEvent = async (obj) => {
    if (obj && obj.data) {
      const feature = obj.data.marker;
      if (feature && feature.getId()) {
        const rawId = feature.getId();
        console.log('raw id:', rawId);
        const arrRawId = rawId.split(':');
        if (arrRawId.length > 2) {
          this.setState({ showAlert: !this.state.showAlert});
          this.setState({ device_id: arrRawId[0]});
          this.setState({ device_type: arrRawId[1]});
          this.setState({ service_type: arrRawId[2]});  
        }
      }
    }
  }

  handleConfirmAllEvent = async (obj) => {
    if (obj && obj.data) {
      const feature = obj.data.marker;
      if (feature && feature.getId()) {
        const rawId = feature.getId();
        console.log('raw id:', rawId);
        const arrRawId = rawId.split(':');
        if (arrRawId.length > 2) {
          this.setState({ showAlert: !this.state.showAlert});
          this.setState({ device_id: arrRawId[0]});
          this.setState({ device_type: arrRawId[1]});
          this.setState({ service_type: arrRawId[2]});  
        }
      }
    }
  }

  handleAcknowledgeAllEvent = () => {
    this.setState({ showAlert: !this.state.showAlert});
    this.props.setAcknowledge(this.state.device_id, this.state.device_type, this.state.service_type);
  }
  handleChangeCamera = (e) => {
    this.setState({ modalCurrentCamera: e.currentTarget.value });
  }

  handleChangeBuilding = (e) => {
    this.setState({ modalCurrentBuilding: e.currentTarget.value });
  }

  handleChangeFloor = (e) => {
    this.setState({ modalCurrentFloor: e.currentTarget.value });
  }
  
  handleChangeModifyFloor = (e) => {
    this.setState({ modalmodifyFloor: e.currentTarget.value });
  }

  handleChangeModifyBuilding = (e) => {
    this.setState({ modalmodifyBuilding: e.currentTarget.value });
  }
  
  handleChangeInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  
  handleChangeGroupImageId = (e) => {
    const result = e.currentTarget.value;
    this.setState({ modalGroupImageId: result, modalFloorWarn: '' });
  }

  handleDelConfirm = async (e) => {
    console.log('confirm modal: confirm');
    try {
      if (this.state.modalConfirmTitle.indexOf('전원장치 삭제') >= 0) {
		// 삭제하려는 가디언라이트 장치 오버레이창이 열려있는지 확인
        let bClose = false;
        const guardianlite = this.props.deviceList.find((device) => device.idx === parseInt(this.state.modalConfirmIdx));
        if (guardianlite) {
          if (guardianlite.name === this.state.currGuardianlite){
            bClose = true;
          }
        }
        // 가디언라이트 장치삭제 REST API 호출
        const res = await axios.delete('/api/observer/guardianlite', {
          params: {
            idx: this.state.modalConfirmIdx,
            service_type: this.state.modalConfirmServiceType,
          }
        });
        if (bClose) {
          const overlays = this.state.map.getOverlays().getArray();
          if (overlays && overlays.length > 1) {
            overlays[2].setPosition(undefined);
          }
        }

        console.log('del guardianlite:', res);
      } else if (this.state.modalConfirmTitle.indexOf('카메라 삭제') >= 0) {
        // 카메라 삭제 REST API 호출
        const res = await axios.put('/api/observer/camera', {
          id: this.state.modalConfirmIdx,
          service_type: this.state.modalConfirmServiceType,
        });
        if(res.data.message === 'ok'){
          const olmap = this.state.map;
          const overlays = olmap.getOverlays().getArray();
            if (overlays && overlays.length > 1) {
              overlays[0].setPosition(undefined);
            }
        }
        console.log('put camera result:', res);
      } else if (this.state.modalConfirmTitle.indexOf('건물 삭제') >= 0) {
         // 건물 삭제 REST API 호출
        const res = await axios.delete('/api/observer/building', {
          params: {
            idx: this.state.modalConfirmIdx,
            serviceType: this.state.modalConfirmServiceType,
          }
        });
        console.log('del building:', res);
      } else if (this.state.modalConfirmTitle.indexOf('층 삭제') >= 0) {
        // 층 삭제 REST API 호출
        const res = await axios.delete('/api/observer/floor', {
          params:{
            buildingIdx: this.state.modalConfirmIdx,
            serviceType: this.state.modalConfirmServiceType,
            floorName: this.state.modalConfirmFloorName
          }
        })
      }  
    } catch (e) {
      console.log('handleDelConfirm:', e);
    } finally {
      this.setState({
        showDelConfirm: false,
        delFloorModal: false,
        modalConfirmTitle: '',
        modalConfirmMessage: '',
        modalConfirmBtnText: '',
        modalConfirmCancelBtnText: '',
        modalConfirmIdx: undefined,
        modalConfirmServiceType: undefined,
      });
    }
  }

  handleDelCancel = async (e) => {
    console.log('confirm modal: cancel');

    this.setState({
      showDelConfirm: false,
      modalConfirmTitle: '',
      modalConfirmMessage: '',
      modalConfirmBtnText: '',
      modalConfirmCancelBtnText: '',
      modalConfirmIdx: undefined,
      modalConfirmServiceType: undefined,
    });
  }

  handleCloseAlert = async () => {
    this.setState({ showAlert: !this.state.showAlert });
    this.setState({ device_id: undefined });
    this.setState({ device_type: undefined });
    this.setState({ service_type: undefined });
  }

  render() {
    const feature = this.state.selectedFeature;
    const feature2 = this.state.selectedFeature2;
    const featureParseInt = this.state.testFeatureId.split(":")[0];
    const featureId = parseInt(featureParseInt);
    const featureServiceType = this.state.testFeatureId.split(":")[2];
    
    return (
      <div>
        <div ref={this.mapRef} className='gmap'>
          <div id='mouseCoordinate' style={{ display: 'none', position: 'fixed', color: 'black' }}>좌표:</div>
        </div>
        {/* <div id='mouseClick'>{this.state.clickPoint.length > 1?'latit(x경도1):'+this.state.clickPoint[0] + ',' + 'longi(y위도1):'+ this.state.clickPoint[1]:''} </div>
        <div id='mouseClick2'>{this.state.clickPoint2.length > 1?'latit(x경도2):'+this.state.clickPoint2[0] + ',' + 'longi(y위도2):'+ this.state.clickPoint2[1]:''} </div> */}

        {/* 디바이스 추가 모달 */}
        <Modal
          show={this.state.showCameraModal}
          onHide={this.handleShowCameraModal}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              카메라 추가
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Label>카메라 선택</Form.Label>
                <select className="form-control" onChange={this.handleChangeCamera} value={this.state.modalCurrentCamera}>
                  <option></option>
                  {this.props.cameraList && this.props.cameraList.map((camera, index) => {
                    if (camera.longitude === null || camera.latitude === null || camera.longitude === 'null' || camera.latitude === 'null' || camera.longitude === '' || camera.latitude === '') {
                      return <option key={index} value={camera.cameraid}>{camera.cameraid + "." + camera.cameraname}</option>
                    }
                  })}
                </select>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalCameraWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapCamera}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleShowCameraModal}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 건물 추가 모달 */}
        <Modal
          show={this.state.showBuildingModal}
          onHide={this.handleShowBuildingModal}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              건물 추가
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Label>건물명 입력 (*필수)</Form.Label>
                <input className="form-control" onChange={this.handleChangeBuilding} value={this.state.modalCurrentBuilding || ''} placeholder='건물명을 입력하세요'>
                </input>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalBuildingWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapBuilding}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleShowBuildingModal}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 건물 수정 모달 */}
        <Modal
          show={this.state.showBuildingModifyModal} 
          onHide={this.handleModifyBuildingModal}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              건물 이름 수정
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                {/* <Form.Group controlId="formBuildingId">
                  <Form.Label>선택된 건물 이름</Form.Label>
                  <form className="form-control BuildingImage" disabled>
                  <option selected="selected">   {this.state.testFeatureName} </option>
                  </form>
                </Form.Group> 
                <br />*/}
                <Form.Label>건물 이름 입력 (*필수)</Form.Label>
                <input className="form-control" onChange={this.handleChangeModifyBuilding} value={this.state.modalmodifyBuilding || ''} placeholder={this.state.testFeatureName}>
                </input>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalBuildingWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleModifyBuilding}>
              확인
            </Button>
            <Button variant='primary' type='button' onClick={this.handleModifyBuildingModal}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 층 추가 모달 */}
        <Modal
          show={this.state.showFloorModal}
          onHide={this.handleShowFloorModal}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              층 추가
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Label>층 이름 입력 (*필수)</Form.Label>
                <input className="form-control" onChange={this.handleChangeFloor} value={this.state.modalCurrentFloor || ''} placeholder='층 이름을 입력하세요'>
                </input>
                <br />
                <Form.Group controlId="formFloorId">
                  <Form.Label>평면도(층) 이미지 (*필수)</Form.Label>
                  <select className="form-control floorImage" onChange={this.handleChangeGroupImageId} value={this.state.modalGroupImageId}>
                    <option></option>
                    {this.state.floorImageList.map((image, index) => (
                      <option key={index} value={image.name}> {image.name} </option>
                    ))}
                  </select>
                </Form.Group>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalFloorWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddMapFloor}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleShowFloorModal}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 층 수정 모달 */}
        <Modal
          show={this.state.showFloorModifyModal}
          onHide={this.handleModifyFloorModal}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              층 이름 수정
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Group controlId="formFloorId">
                  <Form.Label>층 선택 (*필수)</Form.Label>
                  <select className="form-control floorImage" onChange={this.handleChangeGroupImageId} value={this.state.modalGroupImageId}>
                  <option></option>
                    {this.props.floorList && this.props.floorList.map((floor, index) => {
                      if (featureId && featureServiceType) {
                        if (floor.building_idx === featureId && floor.service_type === featureServiceType) {
                          return <option key={index} value={floor.name}> {floor.name} </option>
                        }
                      }
                    })}
                  </select>
                </Form.Group>
                <br />
                <Form.Label>층 이름 입력 (*필수)</Form.Label>
                <input className="form-control" onChange={this.handleChangeModifyFloor} value={this.state.modalmodifyFloor || ''} placeholder='층 이름을 입력하세요'>
                </input>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalFloorWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleModifyFloor}>
              확인
            </Button>
            <Button variant='primary' type='button' onClick={this.handleModifyFloorModal}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>
        {/* 층 삭제 모달 */}
        <Modal
          show={this.state.delFloorModal}
          onHide={this.handleDelFloorModal}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              층 삭제
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="Idx">
                <Form.Group controlId="formFloorId">
                  <Form.Label>층 목록</Form.Label>
                  <select className="form-control floorImage" onChange={this.handleChangeGroupImageId} value={this.state.modalGroupImageId}>
                  <option></option>
                    {this.props.floorList && this.props.floorList.map((floor, index) =>{
                      if(featureId && featureServiceType){
                        if(floor.building_idx === featureId && floor.service_type === featureServiceType){
                          return <option key={index} value={floor.name}> {floor.name} </option>
                        }
                      }
                    })}
                  </select>
                </Form.Group>
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalFloorWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={(e) => this.handleRemoveFloor(this.state.modalGroupImageId)}>
              삭제
            </Button>
            <Button variant='primary' type='button' onClick={this.handleDelFloorModal}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 가디언라이트 추가 모달 */}
        <Modal
          show={this.state.showGuardianModal}
          onHide={this.handleShowGuardianModal}
          backdrop='static'
          keyboard={false}
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              전원장치 추가
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>이름 (*필수)</Form.Label>
                <Form.Control type='text' maxLength='50' name='modalGuardianName' value={this.state.modalGuardianName} onChange={this.handleChangeInput} placeholder='전원장치 이름을 입력하세요' />
              </Form.Group>
              <Form.Group controlId="formIpaddress">
                <Form.Label>IP Address (*필수)</Form.Label>
                <Form.Control type='text' maxLength='15' name='modalGuardianIpaddress' value={this.state.modalGuardianIpaddress} onChange={this.handleChangeInput} placeholder='전원장치 IP를 입력하세요' />
              </Form.Group>
              <Form.Text style={{ color: 'red' }}>{this.state.modalGuardianWarn}</Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAddGuardianlite}>
              추가
            </Button>
            <Button variant='primary' type='button' onClick={this.handleShowGuardianModal}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 삭제 확인 모달창 */}
        <ModalConfirm 
          showModal = {this.state.showDelConfirm}
          modalTitle = {this.state.modalConfirmTitle}
          modalMessage = {this.state.modalConfirmMessage}
          modalConfirmBtnText = {this.state.modalConfirmBtnText}
          modalCancelBtnText = {this.state.modalConfirmCancelBtnText}
          handleConfirm = {this.handleDelConfirm}
          handleCancel = {this.handleDelCancel}
        />

        {/* 해당 장치의 전체 이벤트 알림 해제 모달창 */}
        <Modal show={this.state.showAlert} centered>
          <Modal.Header>
            <Modal.Title>전체 이벤트 알림 해제</Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 장치의 전체 이벤트 알림을 해제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleAcknowledgeAllEvent}>
              예
            </Button>
            <Button variant="secondary" onClick={this.handleCloseAlert}>
              아니오
            </Button>
          </Modal.Footer>
        </Modal> 
        <div id="popup" className={this.state.cameraPopup}>
          <a href="!#" id="popup-closer" className={this.state.cameraPopup==="ol-popup" ? "ol-popup-closer" : "ol-popup-closer noVideo"}></a>
          <Container id="popup-content">
            <div id="popup-video">
            </div>
          </Container>
          <Container>
            <Row className="popup-content-detail">
              <>
                <OverlayTrigger
                  key={'left'}
                  placement={'left'}
                  overlay={
                    <Tooltip id={`tooltip-left`}>
                      <strong>{feature ? (feature.get('location') ? feature.get('location') : '위치없음'):'위치없음'}</strong>
                    </Tooltip>
                  }
                >
                  <Col className={this.state.cameraPopup === 'ol-popup' ? "ol-popup-content-location" : "ol-popup-content-location noVideo"}><span className="emap-Info-Icon"><i className="mdi mdi-map-marker"></i></span></Col>
                </OverlayTrigger>
                <OverlayTrigger
                  key={'bottom'}
                  placement={'bottom'}
                  overlay={
                    <Tooltip id={`tooltip-bottom`}>
                      <strong>최근 일주일 이벤트 발생: {this.props.eventsByIpForWeek ? this.props.eventsByIpForWeek.length : null}건</strong>
                    </Tooltip>
                  }
                >
                  <Col className="ol-popup-content-event-totalCount"><span className="emap-Info-Icon"><i className="mdi mdi-view-week"></i></span></Col>
              </OverlayTrigger>
              <OverlayTrigger
                key={'right'}
                placement={'right'}
                overlay={
                  <Tooltip id={`tooltip-right`}>
                    <strong className="gmapRightTooltip">장치 상세정보를 확인하려면<br/>클릭하세요.</strong>
                  </Tooltip>
                }
              >
                <Col className={this.state.cameraPopup === 'ol-popup' ? "ol-popup-content-information" : "ol-popup-content-information noVideo"}><span className="emap-Info-Icon" onClick={() => this.props.handleDeviceInformation(feature.get('camera_id'), feature.get('name'), feature.get('serviceType'), feature.get('ipaddress'))}><i className="mdi mdi-information-variant"></i></span></Col>
              </OverlayTrigger>
            </>
          </Row>
        </Container>
        </div>
        <div id="ebell-popup" className={this.state.ebellPopup}>
          <a href="!#" id="ebell-popup-closer" className={this.state.ebellPopup==="ol-ebell-popup" ? "ol-ebell-popup-closer" : "ol-ebell-popup-closer noVideo"}></a>
          <Container id="ebell-popup-content">
            <div id="ebell-popup-video">
            </div>
          </Container>
          <Container>
            <Row className="ebell-popup-content-detail">
              <>
                <OverlayTrigger
                  key={'left'}
                  placement={'left'}
                  overlay={
                    <Tooltip id={`tooltip-left`}>
                      <strong>{feature2 ? (feature2.get('location')? feature2.get('location') : '위치없음'):'위치없음'}</strong>
                    </Tooltip>
                  }
                >
                <Col className={this.state.ebellPopup === "ol-ebell-popup" ? "ol-ebell-popup-content-location" : "ol-ebell-popup-content-location noVideo"}><span className="emap-Info-Icon"><i className="mdi mdi-map-marker"></i></span></Col>
                </OverlayTrigger>
                <OverlayTrigger
                  key={'bottom'}
                  placement={'bottom'}
                  overlay={
                    <Tooltip id={`tooltip-bottom`}>
                      <strong>최근 일주일 이벤트 발생: {this.props.eventsByIpForWeek ? this.props.eventsByIpForWeek.length : null}건</strong>
                    </Tooltip>
                  }
                >
                <Col className="ol-ebell-popup-content-event-totalCount"><span className="emap-Info-Icon"><i className="mdi mdi-view-week"></i></span></Col>
                </OverlayTrigger>
                <OverlayTrigger
                  key={'right'}
                  placement={'right'}
                  overlay={
                    <Tooltip id={`tooltip-right`}>
                      <strong className="gmapRightTooltip">장치 상세정보를 확인하려면<br/>클릭하세요.</strong>
                    </Tooltip>
                  }
                >
                <Col className={this.state.ebellPopup === "ol-ebell-popup" ? "ol-ebell-popup-content-information" : "ol-ebell-popup-content-information noVideo"}><span className="emap-Info-Icon" onClick={() => this.props.handleDeviceInformation(feature2.get('idx'), feature2.get('name'), feature2.get('serviceType'), feature2.get('ipaddress'), feature2.get('type'))}><i className="mdi mdi-information-variant"></i></span></Col>
                </OverlayTrigger>
              </>
            </Row>
          </Container>
        </div>
        {/* <div className='ol-ctx-menu-container' /> */}
        <div id="guardianlite" className='guardianlite'>
          <div className='griditem'>
            {this.state.guardianliteTemper?`Guardian Lite (${this.state.guardianliteTemper}℃)`:`Guardian Lite`}
            <a href="!#" id="guardianlite-closer" className="ol-popup-closer" style={{color: '#FFF'}}></a>
          </div>
          <div className={this.state.guardianliteCh1==='on'?'ch ledgreen':'ch ledred'}>
          </div>
          <div className={this.state.guardianliteCh2==='on'?'ch ledgreen':'ch ledred'}>
          </div>
          <div className={this.state.guardianliteCh3==='on'?'ch ledgreen':'ch ledred'}>
          </div>
          <div className={this.state.guardianliteCh4==='on'?'ch ledgreen':'ch ledred'}>
          </div>
          <div className={this.state.guardianliteCh5==='on'?'ch ledgreen':'ch ledred'}>
          </div>
          <div>CH1</div>
          <div>CH2</div>
          <div>CH3</div>
          <div>CH4</div>
          <div>CH5</div>
          <div style={{fontSize:'0.7rem'}}><button onClick={(e) => {this.handleGuardianliteSetBtn(e, 1, 'on')}}>RESET</button></div>
          <div style={{fontSize:'0.7rem'}}><button onClick={(e) => {this.handleGuardianliteSetBtn(e, 2, this.state.guardianliteCh2)}}>On/Off</button></div>
          <div style={{fontSize:'0.7rem'}}><button onClick={(e) => {this.handleGuardianliteSetBtn(e, 3, this.state.guardianliteCh3)}}>On/Off</button></div>
          <div style={{fontSize:'0.7rem'}}><button onClick={(e) => {this.handleGuardianliteSetBtn(e, 4, this.state.guardianliteCh4)}}>On/Off</button></div>
          <div style={{fontSize:'0.7rem'}}><button onClick={(e) => {this.handleGuardianliteSetBtn(e, 5, this.state.guardianliteCh5)}}>On/Off</button></div>
          {/* <div className='griditem'>Guardian Lite</div> */}
        </div>
      </div>
    );
  }
}

export default GMap;
