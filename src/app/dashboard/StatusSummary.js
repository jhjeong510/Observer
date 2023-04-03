import React, { Component } from 'react';
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "정상", value: 300 },
  { name: "임계치 근접", value: 300 },
  { name: "임계치 초과", value: 100 }
];
const COLORS = ["#00C49F", "#FFBB28", "#CC0000"];

class StatusSummary extends Component {

  render() {
    return (
      <div className="defaultBillboard">
        {/* <div className='statussummary'>
          <div className="statussummaryLabel">
            오늘 이벤트
          </div>
          <div className='errorOccur'>
            장애 발생:
            &nbsp;{this.props.todayEventList.filter((event) => !(event.connection)).length}건
          </div>
          <div className="emergencyStatus">
            긴급 상황: 
            &nbsp;{this.props.todayEventList.filter((event) => event.event_type_severity === 3).length}건
          </div>
          <div className='unConfirmed'>
            미확인:
            &nbsp;{this.props.todayEventList.filter((event) => !(event.acknowledge)).length}건
          </div>
        </div>
        <div className="smartErrorAlarm">
          <div className="smartErrorAlarmLabel">
            네트워크 상태별 장비 현황
          </div>
          <div>
            <PieChart width={180} height={100} >
              <Pie
                data={data}
                isAnimationActive={false}
                cx={80}
                cy={90}
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              > 
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div> */}
      </div>
    );
  }
}

export default StatusSummary;