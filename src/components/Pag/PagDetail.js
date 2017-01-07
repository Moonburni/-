import React from 'react'
import './pag-super.css'
import {Link} from 'react-router'

export default class PagDetail extends React.Component{

    state = {
        data: [{
            key: '1',
            name: '111',
            time: '111',
            id: '111',
            cover:'',
            content:''
        }]
    };
    render =()=>{


        return (
            <div className="pagDetail">
                <p>删除</p>
                <p><Link to={`/pagChange${this.props.params.id}`}>编辑</Link></p>
                <div className="LaunchDetail">
                    <div className="textContent">
                        <span>奖品示例图</span>
                        <div style={{borderTop: 'solid 1px #F06444'}}></div>
                        <span>奖品名称</span>
                        <div></div>
                        <span>奖品价值</span>
                        <div></div>
                        <span>赞助商</span>
                        <div></div>
                        <span>奖品描述</span>
                        <div></div>
                        <span>奖品类型</span>
                        <div></div>
                        <span>商品URL</span>
                        <div></div>
                        <span>广告视频</span>
                        <div></div>
                    </div>
                </div>
            </div>
        )
    }
}
