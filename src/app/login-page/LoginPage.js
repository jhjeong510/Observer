import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';

export class LoginPage extends Component {
  render() {
    return (
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="card text-left py-5 px-4 px-sm-5">
                <div className="brand-logo2">
                  <img src={require("../../assets/images/login_logo.png")} alt="logo" />
                </div>
                <h2 className="loginTitle">GIT Observer</h2>
                <h6 className="font-weight-light">Sign in to continue.</h6>
                <Form className="pt-3">
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="email" placeholder="Username" size="lg" className="h-auto" />
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="password" placeholder="Password" size="lg" className="h-auto" />
                  </Form.Group>
                  <Form.Group>
                    <Link className="btn btn-block btn-primary2 btn-lg font-weight-medium auth-form-btn2" to="/dashboard">SIGN IN</Link>
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
    )
  }
}

export default LoginPage