import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './components/app';

import Home from './components/pages/home';
import UserLogin from './components/user/login';
import UserRegister from './components/user/register';
import UserAccount from './components/user/account';
import ResetPassword from './components/user/reset_password';
import Tutor from './components/pages/tutor';
import TutorProfile from './components/pages/tutor_profile';
import FindTutors from './components/pages/find_tutors';
import Sessions from './components/pages/sessions';
import ContactUs from './components/pages/contact_us';
import FinishedContacting from './components/pages/finished_contacting';
import Notifications from './components/pages/notifications';
import Live from './components/pages/live';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/login" component={UserLogin}/>
    <Route path="/register" component={UserRegister}/>
    <Route path="/reset" component={ResetPassword}/>
    <Route path="/account" component={UserAccount}/>
    <Route path="/tutors" component={FindTutors}/>
    <Route path="/schedule" component={Tutor}/>
    <Route path="/tutor_profile" component={TutorProfile}/>
    <Route path="/sessions" component={Sessions}/>
    <Route path="/help" component={ContactUs}/>
    <Route path="/messagesent" component={FinishedContacting}/>
    <Route path="/tutor" component={Tutor}/>
    <Route path="/notifications" component={Notifications} />
    <Route path="/live" component={Live} />
  </Route>

);
