import React from 'react'
import './pag-super.css'
import {Link, hashHistory} from 'react-router'
import {Modal, message} from 'antd'
import {getSingleSuperData, delSingleSuperData} from '../Server/Server'

const confirm = Modal.confirm;

export default class PagDetail extends React.Component {

    state = {
        data: null
    };

    componentWillMount() {
        getSingleSuperData(this.props.params.id)
            .then(({jsonResult}) => {
                console.log(jsonResult.data);
                this.setState({
                    data: jsonResult.data
                });
            });
    }


    render = ()=> {

        const showConfirm = ()=> {
            let that = this;
            confirm({
                title: '是否删除此红包?',
                content: '删除之后将无法恢复',
                onOk() {
                    delSingleSuperData(that.props.params.id).then(()=> {
                        hashHistory.push('/superList')
                    }).catch((err)=> {
                        message.error(err, 3)
                    })
                },
                onCancel() {
                },
            });
        };

        const bodyBuild =()=>{
            if(this.state.data != null){
                return (
                    <div className="pagDetail">
                        <p onClick={showConfirm}>删除</p>
                        <p><Link to={`/pagChange${this.props.params.id}`}>编辑</Link></p>
                        <div className="LaunchDetail">
                            <div className="textContent">
                                <span>奖品示例图</span>
                                <div>
                                    <img style={{
                                        margin:'auto',
                                        marginTop:'10px',
                                    }} src={`${this.state.data.coverImageUrl}?imageView2/1/w/300/h/160`}/>
                                </div>
                                <span>奖品名称</span>
                                <div>{this.state.data.prizeName}</div>
                                <span>奖品价值</span>
                                <div>{this.state.data.price}</div>
                                <span>赞助商</span>
                                <div>{this.state.data.sponsor}</div>
                                <span>奖品描述</span>
                                <div>{this.state.data.description}</div>
                                <span>奖品类型</span>
                                <div>{this.state.data.prizeType}</div>
                                <span>商品URL</span>
                                <div>{this.state.data.goodsUrl}</div>
                                <span>广告视频</span>
                                <div>{this.state.data.adUrl}</div>
                            </div>
                        </div>
                    </div>
                )
            }else{
                return ''
            }
        };

        return (
            <div>
                {bodyBuild()}
            </div>
        )
    }
}
