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

// onEnter={(_ignore, replace)=> {
//     if (!cookie.getJSON('token')) {
//         replace(`/`);
//     }
// }}
const Routes = () => {
    return (
        <Router history={hashHistory}>
            <Route path='/' component={Login}/>
            <Route path="/app" component={App}>
                <IndexRoute  component={Send}/>
                <Route path='/send' component={Send}>

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
