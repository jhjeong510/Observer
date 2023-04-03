// import axios from 'axios'

// const BASE_URL = '주소~'

// // 단순 get요청으로 인증값이 필요없는 경우
// const axiosApi = (url, options) => {
//   const instance = axios.create({ baseURL: url, ...options })
//   return instance
// }

// // post, delete등 api요청 시 인증값이 필요한 경우
// const axiosAuthApi = (url, options) => {
//   const token = '토큰 값'
//   const instance = axios.create({
//     baseURL: url,
//     headers: { Authorization: 'Bearer ' + token },
//     ...options,
//   })
//   return instance
// }

// export const defaultInstance = axiosApi(BASE_URL)
// export const authInstance = axiosAuthApi(BASE_URL)

import axios from 'axios'

const observer_BASE_URL = `http://${process.env.REACT_APP_WEBSOCKET_URL}:${process.env.REACT_APP_PORT}/api/observer/`;
// const observer_BASE_URL = 'http://localhost:3000/api/observer/';
const defaultOptions = {};

const axiosProvider = (props, options) => {
	return axios.create({
		baseURL: observer_BASE_URL,
	});
}

const axiosAutoProvider = (props, options) => {
	const token = 'tokenValue'
	const instance = axios.create({
		baseURL: props,
		// headers: { Authorization: 'Observer ' + token },
		...options,
	})
	return instance
}

export const API = axiosProvider(observer_BASE_URL);
export const AuthAPI = axiosAutoProvider(observer_BASE_URL);
