import React from 'react';
import  {Route, IndexRoute} from 'react-router';
import App from './components/app';

import HomeIndex from './components/pages/home';
import UserLogin from './components/user/login';
import UserLogout from './components/user/logout';
import UserRegister from './components/user/register';
import UserProfile from './components/user/profile';
import ResetPassword from './components/user/reset_password';
import Tutor from './components/pages/tutor';
import Student from './components/pages/student';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomeIndex}/>
    <Route path="/login" component={UserLogin}/>
    <Route path="/logout" component={UserLogout}/>
    <Route path="/register" component={UserRegister}/>
    <Route path="/reset" component={ResetPassword}/>
    <Route path="/account" component={UserProfile}/>
    <Route path="/tutor" component={Tutor}/>
    <Route path="/student" component={Student}/>
  </Route>

);
