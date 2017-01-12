import React from 'react'
import {Table,Modal,message} from 'antd'
import {Link} from 'react-router'
import {getSuperData,delSingleSuperData} from '../Server/Server'


const confirm = Modal.confirm;

export default class SuperList extends React.Component {

    state = {
        loading:true,
        columns: [{
            title: '奖品名称',
            dataIndex: 'prizeName',
            key: 'prizeName',
        }, {
            title: '奖品描述',
            dataIndex: 'description',
            key: 'description',
        }, {
            title: '上限',
            dataIndex: 'upperLimit',
            key: 'upperLimit',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                   <Link to={`/pagDetail${record.superRpId}`}>查看</Link>
                   <span className="ant-divider"/>
                   <Link to={`/pagChange${record.superRpId}`}>编辑</Link>
                   <span className="ant-divider"/>
                   <a onClick={this.showConfirm(record.superRpId)}>删除</a>
                </span>
            ),
        }]
    };

    componentWillMount() {
        getSuperData()
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
                    content: '删除之后将无法恢复',
                    onOk() {
                        delSingleSuperData(id).then(()=> {
                            getSuperData()
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

    render = ()=> {


        return (
            <div>
                <Link to="/create">
                    <div className="btn">添加红包</div>
                </Link>
                <div style={{width: '920px', marginTop: '20px'}}>
                    <Table rowKey={recode => recode.superRpId} dataSource={this.state.data} columns={this.state.columns}
                           bordered loading={this.state.loading}/>
                </div>
            </div>
        )
    }
}
