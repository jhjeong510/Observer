import React from 'react';
import CheckboxTree from 'react-checkbox-tree';
import axios from 'axios';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

class DeviceTree extends React.Component {

  state = {
    building: [],
    floor: [],
    device: [],
    treeData: [{
      value: '그린아이티코리아',
      label: '그린아이티코리아',
      children: [],
      showCheckbox: false,
      
    }],
    checked: [],
    expanded: [],
  }

  readTreeData = async () => {
    console.log('readTreeData');
    try {
      // 건물정보 조회
      const resBuilding = await axios.get('api/observer/building');
      if (resBuilding && resBuilding.data && resBuilding.data.result) {
        console.log('readBuildingData:', JSON.stringify(resBuilding.data.result, null, 2));
        const newBuilding = JSON.parse(JSON.stringify(resBuilding.data.result));
        this.setState({
          building: newBuilding
        });
      }
      // 층정보 조회
      const resFloor = await axios.get('api/observer/floor');
      if (resFloor && resFloor.data && resFloor.data.result) {
        this.setState({
          floor: resFloor.data.result
        });
      }
      // 장비정보 조회
      const resDevice = await axios.get('api/observer/device');
      if (resDevice && resDevice.data && resDevice.data.result) {
        this.setState({
          device: resDevice.data.result
        });
      }

      const newTreeData = JSON.parse(JSON.stringify(this.state.treeData));
      console.log('newTreeData:', JSON.stringify(newTreeData, null, 2));
      if (resBuilding && resBuilding.data && resBuilding.data.result) {
        resBuilding.data.result.forEach((building) => {
          console.log('builing item', JSON.stringify(building));
          newTreeData[0].icon = <i className="fas fa-globe-asia"></i>;
          newTreeData[0].children.push({
            idx: building.idx,
            service_type: building.service_type,
            value: building.name,
            label: building.name,
            icon: <i className="fas fa-building"></i>,
            showCheckbox: false,
            children: []
          });
        });
      }
      newTreeData[0].children.push({
        idx: 0,
        service_type: 'observer',
        value: '실외장비그룹',
        label: '실외장비그룹',
        icon: <i className="fas fa-building"></i>,
        showCheckbox: false,
        children: []
      });
      if (resFloor && resFloor.data && resFloor.data.result) {
        resFloor.data.result.forEach((floor) => {
          const foundBuilding = newTreeData[0].children.find((itemBuilding) => (itemBuilding.idx === floor.building_idx)&&(itemBuilding.service_type === floor.service_type));
          if (foundBuilding) {
            foundBuilding.children.push({
              idx: floor.idx,
              service_type: floor.service_type,
              value: floor.name,
              label: floor.name,
              icon: <i className="fas fa-layer-group"></i>,
              showCheckbox: false,
              children: [],
            });
          }
        });
      }
      if (resDevice && resDevice.data && resDevice.data.result) {
        resDevice.data.result.forEach((device) => {
          let foundFloor;
          for (let i=0; i < newTreeData[0].children.length; i++) {
            const building = newTreeData[0].children[i];
            foundFloor = building.children.find((floor) => (floor.idx === device.floor_idx) && (floor.service_type === device.service_type));
            if (foundFloor) {
              foundFloor.children.push({
                  idx: device.idx,
                  service_type: device.service_type,
                  value: device.name,
                  label: device.name,
                  icon: <i className="far fa-bell"></i>,
                  showCheckbox: false,
              });
              break;
            }
          }
        });
      }
      console.log('newTreeData:', JSON.stringify(newTreeData, null, 2));
      this.setState({ treeData: newTreeData });
    } catch(error) {
      console.log('readTreeData Error:', error);
    }
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.readTreeData();
  }

  render() {    
    console.log('render (building):', JSON.stringify(this.state.building, null, 2));
    const textBuilding = this.state.building.length > 0? JSON.stringify(this.state.building):'빈배열';
    return (
      <div >
                
        <div>
          building: {textBuilding}
        </div>
        <div>
          treeData: {JSON.stringify(this.state.treeData)}
        </div>
        <div style={{border: '1px solid blue'}}>
          <CheckboxTree
            nodes={this.state.treeData}
            checked={this.state.checked}
            expanded={this.state.expanded}
            onCheck={checked => this.setState({ checked })}
            onExpand={expanded => this.setState({ expanded })}
            iconsClass="fa5"
          />
        </div>
      </div>
    );
  }
}

export default DeviceTree;