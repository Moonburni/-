import React from 'react'
import {Table, Input, Icon, Button, Popconfirm, message, Upload, Modal} from 'antd'
import {Link} from 'react-router'
import {getBlessData, delSingleBlessData, postBlessData, putBlessData, getQiNiuToken} from '../Server/Server'
import {qiNiu, qiNiuDomain} from '../../../config'
import cookie from 'js-cookie';

const confirm = Modal.confirm;
export default class Bless extends React.Component {


    state = {
        dataSource: [],
        count: 0,
        loading: true,
        visible: false,
        imageUrl: '',
        value: '',
        singleData: ''
    };


    componentDidMount() {
        getBlessData()
            .then(({jsonResult}) => {
                // console.log(jsonResult.data);
                this.setState({
                    dataSource: jsonResult.data,
                    count: jsonResult.data.length,
                    loading: false
                });
            });
        getQiNiuToken()
            .then(({jsonResult}) => {
                // console.log(jsonResult.data.QNToken);
                cookie.set('QNToken', jsonResult.data.QNToken);
            });
    };

    showConfirm = (id)=> {
        let that = this;
        return (
            ()=> {
                confirm({
                    title: '是否删除此红包?',
                    content: '删除之后将无法恢复',
                    onOk() {
                        delSingleBlessData(id).then(()=> {
                            getBlessData()
                                .then(({jsonResult}) => {
                                    // console.log(jsonResult.data);
                                    that.setState({
                                        dataSource: jsonResult.data
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
    showModal = (value)=> {
        let that = this;
        return (
            ()=> {
                if (value === '') {
                    that.setState({
                        visible: true,
                    });
                } else {
                    console.log(value);
                    that.setState({
                        visible: true,
                        singleData: value,
                        imageUrl: value.imageUrl,
                        value:value.blessWord
                    });
                }
            }
        )

    };
    handleOk = ()=> {
        let data = {
            imageUrl: this.state.imageUrl,
            blessWord: this.state.value || this.state.singleData.blessWord
        };
        if (this.state.singleData != '') {
            putBlessData(this.state.singleData.blessRpId, data).then(()=> {
                getBlessData()
                    .then(({jsonResult}) => {
                        // console.log(jsonResult.data);
                        this.setState({
                            dataSource: jsonResult.data,
                            count: jsonResult.data.length,
                            singleData: '',
                            visible: false,
                            imageUrl: '',
                            value:''
                        });
                    });
            })
        } else {
            postBlessData(data).then(
                ({jsonResult})=> {
                    this.setState({
                        dataSource: [jsonResult.data, ...this.state.dataSource],
                        visible: false,
                        value:''
                    });
                }
            );
        }
    };
    handleCancel = (e)=> {
        // console.log(123);
        this.setState({
            visible: false,
            singleData: '',
            imageUrl: '',
            value:''
        });
    };
    handleChangeOther = (info)=> {
        if (info.file.status === 'done') {
            this.setState({
                imageUrl: qiNiuDomain + '/' + info.file.response.key,
            })
        } else if (info.file.status === 'error') {
            message.error('该文件名已存在，请重命名文件', 3)
        }
    };


    headersBuilder = (file)=> {
        return ({
            token: cookie.get('QNToken'),
            key: 'coverImage/' + file.name
        });
    };

    handleChange = (e) => {
        const value = e.target.value;
        this.setState({
            value: value
        });
    };

    handleChange1 = (e) => {
        console.log(e.target.value);
        const value = e.target.value || this.state.singleData.blessWord;
        this.setState({
            value: value,
        });
    };

    render = ()=> {

        const columns = [
            {
                title: '祝福卡片',
                dataIndex: 'imageUrl',
                width: '20%',
                render: (text, record, index) => {
                    return (
                        <img src={text} style={{width: '200px'}}/>
                    )
                }
            },
            {
                title: '标题',
                dataIndex: 'blessWord',
                width: '60%',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                        <span>
                            <a onClick={this.showModal(record)}>编辑</a>
                            <span className="ant-divider"/>
                            <a onClick={this.showConfirm(record.blessRpId)}>删除</a>
                        </span>
                    );
                },
            }];

        return (
            <div>
                <div className="btn" style={{marginBottom: '20px'}} onClick={this.showModal('')}>添加红包</div>
                <Table bordered rowKey={recode => recode.blessRpId} dataSource={this.state.dataSource} columns={columns}
                       style={{width: '920px'}} loading={this.state.loading}/>
                <Modal title="添加祝福红包" visible={this.state.visible}
                       onOk={this.handleOk} onCancel={this.handleCancel}
                >{
                    this.state.singleDta ?
                        <div>
                            <div>
                                添加祝福卡片
                                <Upload
                                    name="file"
                                    showUploadList={false}
                                    action={qiNiu}
                                    onChange={this.handleChangeOther}
                                    data={this.headersBuilder}
                                >{
                                    this.state.imageUrl ?
                                        <img src={this.state.imageUrl} style={{width: '200px'}} alt=""
                                             className="avatar"/> :
                                        <Icon type="plus" className="avatar-uploader-trigger"/>
                                }
                                </Upload>
                            </div>
                            <div>
                                添加标题<Input value={this.state.value} onChange={this.handleChange}
                                           style={{width: '60%', marginLeft: '20px'}}/>
                            </div>
                        </div> :
                        <div>
                            <div>
                                添加祝福卡片
                                <Upload
                                    name="file"
                                    showUploadList={false}
                                    action={qiNiu}
                                    onChange={this.handleChangeOther}
                                    data={this.headersBuilder}
                                >{
                                    this.state.imageUrl ?
                                        <img src={this.state.imageUrl} style={{width: '200px'}} alt=""
                                             className="avatar"/> :
                                        <Icon type="plus" className="avatar-uploader-trigger"/>
                                }
                                </Upload>
                            </div>
                            <div>
                                添加标题<Input value={this.state.value} onChange={this.handleChange1}
                                           style={{width: '60%', marginLeft: '20px'}}/>
                            </div>
                        </div>

                }
                </Modal>
            </div>
        )
    }
}
