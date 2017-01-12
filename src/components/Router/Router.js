import React, {PropTypes} from 'react';
import {Router, RouteHandler, Route, hashHistory, IndexRoute} from "react-router";
import App from '../App'
import Content from '../Content'
import Send from '../Send'
import Login from '../Login/Login'
import Bless from '../Pag/Bless'
import Super from '../Pag/Super'
import PagDetail from '../Pag/PagDetail'
import PagChange from '../Pag/PagChange'
import SuperList from '../Pag/SuperList'
import Create from '../Pag/Create'
import Clock from '../Sender/Clock'
import ClockList from '../Sender/ClockList'
import ClockDetail from '../Sender/ClockDetail'
import ClockChange from '../Sender/ClockChange'
import cookie from 'js-cookie'


const Routes = () => {
    return (
        <Router history={hashHistory}>
            <Route path='/' component={Login}/>
            <Route path="/app" component={App}
                   onEnter={(_ignore, replace)=> {
                       if (!cookie.getJSON('token')) {
                           replace(`/`);
                       }
                   }}>
                <IndexRoute  component={Send}/>
                <Route path='/send' component={Send}>
                    <IndexRoute component={Clock}/>
                    <Route path='/clock' component={Clock}>
                        <IndexRoute component={ClockList}/>
                        <Route path='/clockList' component={ClockList}/>
                        <Route path='/clockDetail:id' component={ClockDetail}/>
                        <Route path='/clockChange:id' component={ClockChange}/>
                    </Route>
                </Route>
                <Route path='/content' component={Content}>
                    <IndexRoute component={Super}/>
                    <Route path='/super' component={Super}>
                       <IndexRoute component={SuperList}/>
                       <Route path='/create' component={Create}/>
                       <Route path='/superList' component={SuperList}/>
                       <Route path='/pagDetail:id' component={PagDetail}/>
                       <Route path='/pagChange:id' component={PagChange}/>
                    </Route>
                    <Route path='/bless' component={Bless}/>
                </Route>
            </Route>
        </Router>
    )
};


export default Routes;
