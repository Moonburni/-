import React from 'react'
import './content.css'
import {Link} from 'react-router'

export default class Content extends React.Component{

    render =()=>{
        return (
            <div className="content">
                <ul>
                    <li><Link to='/super' activeStyle={{color:'#F06444',borderBottom:'solid 4px #F06444'}}>超级红包</Link></li>
                    <li><Link to='/bless' activeStyle={{color:'#F06444',borderBottom:'solid 4px #F06444'}}>祝福红包</Link></li>
                </ul>
                <div style={{marginTop:'20px',marginLeft:'40px'}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
