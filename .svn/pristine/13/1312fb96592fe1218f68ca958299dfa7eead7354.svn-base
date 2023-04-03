import React from 'react';

export const UserInfoContext = React.createContext({
  logined: false,
  id: '',
  token: '',
  websocket_url: '', 
  mapserver_url: '', 
  lang: 'korean',
  setUserInfo: function (_logined, _id, _token, _websocket_url, _mapserver_url, lang = 'korean') {
    this.logined = _logined;
    this.id = _id;
    this.token = _token;
    this.websocket_url = _websocket_url;
    this.mapserver_url = _mapserver_url;
    this.lang = lang;
  }
});