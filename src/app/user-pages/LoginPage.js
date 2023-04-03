import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { UserInfoContext } from '../context/context';
import { Redirect } from 'react-router-dom';
import styles from './LoginPage.module.css';

export class LoginPage extends Component {

  static contextType = UserInfoContext;

  state = {
    id: '',
    password: '',
    message: '',    
  }

  componentDidMount() {
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  handleLogin = async (e) => {
    e.preventDefault();
    if (this.state.id.length === 0) {
      this.setState({ message: '*Username 을 입력하세요'});
      return;
    } else if (this.state.id.length > 30) {
      this.setState({ message: '*Username 은 최대 30글자 입니다'});
      return;
    } else if (this.state.password.length === 0) {
      this.setState({ message: '*Password 를 입력하세요'});
      return;
    } else if (this.state.password.length > 30) {
      this.setState({ message: '*Password 는 최대 30글자 입니다.'});
      return;
    }
    try {
      const res = await axios.post('/api/observer/login', {
        id: this.state.id,
        password: this.state.password
      });
      console.log('login res:', res);
      if (res && res.data && res.data.result) {
        this.setState({ message: '' });
        this.context.setUserInfo(true, res.data.result.id, res.data.result.token, res.data.result.websocket_url, res.data.result.mapserver_url);
        localStorage.setItem('userInfo', JSON.stringify({
          logined: true,
          id: res.data.result.id,
          token: res.data.result.token,
          websocket_url: res.data.result.websocket_url,
          mapserver_url: res.data.result.mapserver_url,
          lang: 'korean'
        }));
        this.props.history.push('/dashboard');
      }
    } catch(err) {
      console.log('login err:', err);
      if (err.response && err.response.data && err.response.data.error) {
        if (err.response.data.error.code === 1) {
          this.setState({ message: '*존재하지 않는 Username 이거나 잘못된 Password 입니다.'});
        } else {
          this.setState({ message: err.response.data.error.message });
        }
      }
    }
  }

  handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleLogin(e);
    }
  }

  render() {
    console.log('Login context:', this.context);
    if (this.context.logined === true) {
      return <Redirect to='/dashboard'/>
    } else {
      return (
        <UserInfoContext.Provider>
          <div className="d-flex align-items-center auth px-0">
            <div className="row w-100 mx-0">
              <div className="col-lg-4 mx-auto">
                <div className="card text-left py-5 px-4 px-sm-5">
                  <div className="brand-logo2">
                    <img src={require("../../assets/images/login_logo.png")} alt="logo" />
                  </div>
                  <div className={styles.loginTitle}>
                  <h2 className={styles.loginTitle_GIT}>GIT </h2>
                  <h2 className={styles.loginTitle_Observer}> Observer</h2>
                  </div>
                  {/* <h6 className="font-weight-light">Sign in to continue.</h6> */}
                  <h6 className={styles.font_weight_light}>Sign in to continue.</h6>

                  <Form className="pt-3">
                    <Form.Group className="d-flex search-field">
                      <Form.Control name='id' type="text" placeholder="Username" value={this.state.id} onChange={this.handleInputChange} size="lg" className="h-auto" />
                    </Form.Group>
                    <Form.Group className="d-flex search-field">
                      <Form.Control name='password' type="password" placeholder="Password" value={this.state.password} onChange={this.handleInputChange} onKeyPress={this.handleEnterKeyPress} size="lg" className="h-auto" />
                    </Form.Group>
                    <Form.Group>
                      <button className={styles.signBtn} onClick={this.handleLogin}>SIGN IN</button>
                    </Form.Group>
                    <Form.Group>
                      <label className='text-danger'>{this.state.message}</label>
                    </Form.Group>
                    <div className="my-2 d-flex justify-content-between align-items-center">
                      {/* <div className="form-check">
                        <label className="form-check-label text-muted">
                          <input type="checkbox" className="form-check-input"/>
                          <i className="input-helper"></i>
                          Keep me signed in
                        </label>
                      </div> */}
                      {/* <a href="!#" onClick={event => event.preventDefault()} className="auth-link text-muted">Forgot password?</a> */}
                    </div>
                    {/* <div className="text-center mt-4 font-weight-light">
                      Don't have an account? <Link to="/user-pages/register" className="text-primary">Create</Link>
                    </div> */}
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </UserInfoContext.Provider>
      );
    }
  }
}

export default LoginPage
