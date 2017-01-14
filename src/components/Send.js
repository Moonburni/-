import React from 'react'
import './content.css'
import {Link} from 'react-router'

export default class Send extends React.Component{

    render =()=>{
        return (
            <div className="content">
                <ul>
                    <li><Link to='/clock' activeStyle={{color:'#F06444',borderBottom:'solid 4px #F06444'}}>整点红包</Link></li>
                </ul>
                <div style={{marginTop:'20px',marginLeft:'40px'}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
