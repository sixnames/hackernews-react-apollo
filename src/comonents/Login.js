import React, {useState} from "react";
import {AUTH_TOKEN} from "../constants";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

function Login({history}) {
  const [state, setState] = useState({
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
  });
  const {login, email, password, name} = state;
  
  function _saveUserData(token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
  
  function _confirm(data) {
    const {token} = state.login ? data.login : data.signup;
    _saveUserData(token);
    history.push(`/`)
  }
  
  return (
    <div>
      <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
      <div className="flex flex-column">
        {!login && (
          <input
            value={name}
            onChange={({target}) => setState((prevState) => {
              return {
                ...prevState,
                name: target.value
              }
            })}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={email}
          onChange={({target}) => setState((prevState) => {
            return {
              ...prevState,
              email: target.value
            }
          })}
          type="text"
          placeholder="Your email address"
        />
        <input
          value={password}
          onChange={({target}) => setState((prevState) => {
            return {
              ...prevState,
              password: target.value
            }
          })}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <Mutation mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                  variables={{email, password, name}}
                  onCompleted={data => _confirm(data)}>
          {(mutation) => {
            return (
              <div className="pointer mr2 button" onClick={mutation}>
                {login ? 'login' : 'create account'}
              </div>
            )
          }}
        </Mutation>
        <div
          className="pointer button"
          onClick={() => setState((prevState) => ({...prevState, login: !login}))}
        >
          {login
            ? 'need to create an account?'
            : 'already have an account?'}
        </div>
      </div>
    </div>
  );
}

export default Login;