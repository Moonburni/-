import React from 'react'
import {Table,Modal,message} from 'antd'
import {Link} from 'react-router'
import {getHourData,delSingleHourData} from '../Server/Server'
import {hashHistory} from "react-router"


const confirm = Modal.confirm;

export default class ClockList extends React.Component {

    state = {
        loading:true,
        data:null,
        columns: [{
            title: '时段',
            dataIndex: 'timeSize',
            key: 'timeSize',
            render: (text, record) => (
                <span>
                    {record.startDayTime}~{record.endDayTime}&nbsp;&nbsp;
                    {record.startHourTime}:00:00~{record.endHourTime}:00:00
                </span>
            ),
        }, {
            title: '红包总数',
            dataIndex: 'totalNum',
            key: 'totalNum',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                   <Link to={`/clockDetail${record.hourRpSettingId}`}>查看</Link>
                   <span className="ant-divider"/>
                   <a onClick={this.showConfirm1(record.hourRpSettingId)}>编辑</a>
                   <span className="ant-divider"/>
                   <a onClick={this.showConfirm(record.hourRpSettingId)}>删除</a>
                </span>
            ),
        }]
    };

    componentWillMount() {
        getHourData()
            .then(({jsonResult}) => {
                // console.log(jsonResult.data);
                this.setState({
                    data: jsonResult.data,
                    loading:false
                });
            });
    }

    showConfirm = (id)=> {
        let that = this;
        return (
            ()=> {
                confirm({
                    title: '是否删除此红包?',
                    content: '删除之后将无法恢复，并且会损失这段时间的红包发送哦？',
                    onOk() {
                        delSingleHourData(id).then(()=> {
                            getHourData()
                                .then(({jsonResult}) => {
                                    // console.log(jsonResult.data);
                                    that.setState({
                                        data: jsonResult.data
                                    });
                                });
                        }).catch((err)=> {
                            message.error(err, 3)
                        })
                    },
                    onCancel() {
                    },
                });
            }
        )
    };
    showConfirm1 = (id)=> {
        return (
            ()=> {
                confirm({
                    title: '是否修改此红包?',
                    content: '修改之后会损失这段时间的红包发送哦？',
                    onOk() {
                        hashHistory.push(`/clockChange${id}`)
                    },
                    onCancel() {
                    },
                });
            }
        )
    };

    render = ()=> {

        return (
            <div>
                <Link to="/createClock">
                    <div className="btn">添加整点红包</div>
                </Link>
                <div style={{width: '920px', marginTop: '20px'}}>
                    <Table rowKey={recode => recode.hourRpSettingId} dataSource={this.state.data} columns={this.state.columns}
                           bordered loading={this.state.loading}/>
                </div>
            </div>
        )
    }
}

