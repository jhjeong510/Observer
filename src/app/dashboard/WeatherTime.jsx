import React, { Component } from 'react';
import axios from 'axios';
import * as dateFns from "date-fns";
import { ko } from 'date-fns/locale';
import cloudImg from '../../assets/images/cloud.png';
import styles from './WeahterTime.module.css';

class WeatherTime extends Component {
  state = {
    temp: 0,
    desc: '',
    icon: '',
    loading: true,
    lat: '',
    lon: '',
    place: '',
    humidity: '',
    connection: false
  }

  askForCoods = () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.setState({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            connection: true
          }, () => this.getWeather());
        })
      }
      else {
        alert('gps를 지원 안함');
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  getWeather = async () => {
    const apiKey = 'ba007689034eda24db11c2ec0032a701';
    if (this.state.lat !== '' || this.state.lat !== undefined || this.state.lon !== '' || this.state.lon !== undefined || this.state.lat !== null || this.state.lon !== null) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lon}&appid=${apiKey}&units=metric`;
      // console.log(url);
      try {
        const res = await axios.get(url)
        // console.log('res ==> ', res);
        this.setState({
          place: res.data.name,
          temp: res.data.main.temp,
          desc: res.data.weather[0].description,
          icon: res.data.weather[0].icon,
          loading: false,
          humidity: res.data.main.humidity,
        })
      }
      catch (err) {
        console.log(err);
      }
    }
  }

  componentDidMount() {
    this.askForCoods()
  }

  render() {
    const imgSrc = `http://openweathermap.com/img/w/${this.state.icon}.png`;
    let temper = this.state.temp
    return (
      <div className={styles.weatherTime}>
        {this.state.lat && this.state.lon && this.state.connection === true ?
          <div className="main-dateTime">
            <div className="d-flex flex-row justify-content-between">
            </div>
            <div className="row">
              <div className="col-12">
                <div className="preview2-list">
                  <div className="card-body weather">
                    <div className="weather0">
                      {/* <h3 className="font-weight-noraml text-whiite text-center mb-2 text-white "> */}
                      <p className="weathertime time" fontSize='1.4rem'>
                        {dateFns.format(new Date(), "yyyy년 M월 d일", { locale: ko })}
                        {dateFns.format(new Date(), " EEEE HH:mm", { locale: ko })}
                        {/* </h3> */}
                      </p>
                    </div>
                    <div className='weather1'>
                      {/* {this.state.icon && <img src={imgSrc} />} */}
                      <img width='23%' src={cloudImg} />
                      <div className='weather2'>
                        <h4>온도 {temper.toFixed(1)}°C</h4>
                        {/* <h4>Humidity {this.state.humidity}%</h4> */}
                        {/* <p><i className="fas fa-map-marker-alt" style={{ color: 'green' }}></i> {this.state.place}</p>
                        <p><i className="fas fa-map-marker-alt" style={{ color: 'green' }}></i> {this.state.name === 'Seoul' ? '서울특별시 송파구 문정 2동' : '서울시 문정 2동'}</p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <div className={styles.weatherTime}>
            {dateFns.format(new Date(), "yyyy년 M월 d일", { locale: ko })}
            {dateFns.format(new Date(), " EEEE HH:mm", { locale: ko })}
          </div>
        }
      </div>
    );
  }
}
export default WeatherTime;