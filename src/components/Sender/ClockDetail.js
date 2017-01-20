import React from 'react'
import {Link, hashHistory} from 'react-router'
import {Modal, message} from 'antd'
import {getSingleClockData, delSingleHourData} from '../Server/Server'

const confirm = Modal.confirm;

export default class ClockDetail extends React.Component {

    state = {
        data: null
    };

    componentWillMount() {
        getSingleClockData(this.props.params.id)
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
                title: '是否删除此红包?删除之后不可恢复',
                content: '如果红包已经开始定时发送，请谨慎操作（尤其是在设置整点前后5~10分钟，如果修改可能会导致系统数据错乱，甚至系统崩溃，请谨慎操作）',
                onOk() {
                    delSingleHourData(that.props.params.id).then(()=> {
                        hashHistory.push('/clockList')
                    }).catch((err)=> {
                        message.error(err, 3)
                    })
                },
                onCancel() {
                },
            });
        };

        const blessBuild = ()=> {
            if (this.state.data.blessRpPoolSettings.length > 0) {
                return (
                    <span>
                        {this.state.data.blessRpPoolSettings.map((item, index)=> {
                            return (
                                <span key={index} style={{
                                    display: 'inline-block',
                                    width: '200px',
                                    height: '35px',
                                    backgroundColor: '#F06444',
                                    color: 'white',
                                    textAlign: 'center',
                                    marginTop: '6px',
                                    lineHeight: '35px',
                                    marginLeft: '70px',
                                    borderRadius: '5px'
                                }}>
                                    <p style={{
                                        float: 'left',
                                        marginLeft: '25px',
                                        maxWidth: '120px',
                                        overflow: 'hidden'
                                    }}>{item.blessRp.blessWord}</p>
                                    <p style={{float: 'right', marginRight: '25px'}}>{item.num}</p>
                                </span>
                            )
                        })}
                    </span>
                )
            } else {
                return <span style={{
                    display: 'inline-block',
                    width: '200px',
                    height: '35px',
                    backgroundColor: '#F06444',
                    color: 'white',
                    textAlign: 'center',
                    marginTop: '6px',
                    lineHeight: '35px',
                    marginLeft: '70px',
                    borderRadius: '5px'
                }}>
                                   暂无
                                </span>
            }
        };

        const superBuild = ()=> {
            if (this.state.data.superRpPoolSettings.length > 0) {
                return (
                    <span>
                        {this.state.data.superRpPoolSettings.map((item, index)=> {
                            return (
                                <span key={index} style={{
                                    display: 'inline-block',
                                    width: '200px',
                                    height: '35px',
                                    backgroundColor: '#F06444',
                                    color: 'white',
                                    textAlign: 'center',
                                    marginTop: '6px',
                                    lineHeight: '35px',
                                    marginLeft: '70px',
                                    borderRadius: '5px'
                                }}>
                                    <p style={{
                                        float: 'left',
                                        marginLeft: '25px',
                                        maxWidth: '120px',
                                        overflow: 'hidden'
                                    }}>{item.superRp.prizeName}</p>
                                    <p style={{float: 'right', marginRight: '25px'}}>{item.num}</p>
                                </span>
                            )
                        })}
                    </span>
                )
            } else {
                return <span style={{
                    display: 'inline-block',
                    width: '200px',
                    height: '35px',
                    backgroundColor: '#F06444',
                    color: 'white',
                    textAlign: 'center',
                    marginTop: '6px',
                    lineHeight: '35px',
                    marginLeft: '70px',
                    borderRadius: '5px'
                }}>
                                   暂无
                                </span>
            }
        };

        const showConfirm1 = ()=> {
            let th = this;
            confirm({
                title: '是否编辑?',
                content: '如果红包已经开始定时发送，请谨慎编辑（尤其是在设置整点前后5~10分钟，如果修改可能会导致系统数据错乱，甚至系统崩溃，请谨慎操作）',
                onOk() {
                    hashHistory.push(`/clockChange${th.props.params.id}`)
                },
                onCancel() {
                },
            });

        };

        const bodyBuild = ()=> {
            if (this.state.data != null) {
                return (
                    <div className="pagDetail">
                        <p onClick={showConfirm}>删除</p>
                        <p onClick={showConfirm1}>编辑</p>
                        <div className="LaunchDetail">
                            <div className="textContent">
                                <span>选择日期</span>
                                <div style={{height: '46px'}}>
                                    {this.state.data.startDayTime}~{this.state.data.endDayTime}
                                </div>
                                <span>选择时段</span>
                                <div> {this.state.data.startHourTime}:00:00~{this.state.data.endHourTime}:00:00</div>
                                <span>奖池设计</span>
                                <div style={{height: 'auto'}}><span
                                    style={{position: 'absolute'}}>超级红包:</span>{superBuild()}</div>
                                <div style={{height: 'auto'}}><span
                                    style={{position: 'absolute'}}>祝福红包:</span>{blessBuild()}</div>
                            </div>
                        </div>
                    </div>
                )
            } else {
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
