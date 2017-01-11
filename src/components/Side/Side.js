import React from 'react'
import './side.css'
import { Menu, Icon } from 'antd'
import {Link} from 'react-router'
import {hashHistory} from "react-router";

const SubMenu = Menu.SubMenu;


export default class Side extends React.Component{

    state = {
        select:null
    };

    componentDidMount =()=>{
        if(window.location.hash.indexOf('bless') != -1 || window.location.hash.indexOf('super') != -1
            ||window.location.hash.indexOf('create') != -1){
            this.setState({
                select:'2'
            })
        }else{
            this.setState({
                select:'1'
            })
        }
    };

    render =()=>{

        const menuBuild =()=>{
          if(this.state.select != null && this.state.select === '1'){
              return(
                  <Menu mode="inline"
                        theme="dark"
                        defaultOpenKeys={['sub1']}
                        defaultSelectedKeys={['1']}
                  >
                      <SubMenu key="sub1" title={<span><Icon type="pay-circle-o" /><span>红包管理</span></span>}>
                          <Menu.Item key="1"><Link to="/clock">红包发送管理</Link></Menu.Item>
                          <Menu.Item key="2"><Link to="/super">红包内容管理</Link></Menu.Item>
                      </SubMenu>
                  </Menu>
              )
          }else if(this.state.select != null && this.state.select === '2'){
              return(
                  <Menu mode="inline"
                        theme="dark"
                        defaultOpenKeys={['sub1']}
                        defaultSelectedKeys={['2']}
                  >
                      <SubMenu key="sub1" title={<span><Icon type="pay-circle-o" /><span>红包管理</span></span>}>
                          <Menu.Item key="1"><Link to="/clock">红包发送管理</Link></Menu.Item>
                          <Menu.Item key="2"><Link to="/super">红包内容管理</Link></Menu.Item>
                      </SubMenu>
                  </Menu>
              )
          }
        };

        return(
            <div className="side">
                {menuBuild()}
            </div>
        )
    }
}
