import React from 'react'
import {Link, hashHistory} from 'react-router'
import {Modal, message, DatePicker, Select, Icon, Button, Table, Input} from 'antd'
import {getSuperData, getBlessData, postHourData} from '../Server/Server'
import moment from 'moment'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const Option = Select.Option;
const confirm = Modal.confirm;
const {RangePicker} = DatePicker;

export default class CreateClock extends React.Component {

    state = {
        data: [],
        dataOther: [],
        endDayTime: '',
        endHourTime: '',
        startDayTime: '',
        startHourTime: '',
        superRpPoolSettings: [],
        blessRpPoolSettings: [],
        loading: false,
        visible: false,
        selectedRowKeys: [],
        loadingOther: false,
        visibleOther: false,
        selectedRowKeysOther: [],
    };

    showModal = ()=> {
        this.setState({
            visible: true,
        });
    };

    showModalOther = ()=> {
        this.setState({
            visibleOther: true,
        });
    };
    handleOk = ()=> {
        this.setState({loading: true});
        setTimeout(() => {
            let data = [];
            this.state.selectedRowKeys.forEach((item, index)=> {
                data.push({
                        num: document.getElementById(item).value || this.state.data.filter((items)=> {
                            return items.superRpId === item
                        })[0].upperLimit,
                        superRpId: item,
                        superRp: this.state.data.filter((items)=> {
                            return items.superRpId === item
                        })[0]
                    }
                )
            });
            // console.log(data);
            this.setState({loading: false, visible: false, superRpPoolSettings: data});
        }, 1000);
    };
    handleOkOther = ()=> {
        this.setState({loadingOther: true});
        setTimeout(() => {
            let data = [];
            this.state.selectedRowKeysOther.forEach((item, index)=> {
                data.push({
                        num: document.getElementById(item).value || 100,
                        blessRpId: item,
                        blessRp: this.state.dataOther.filter((items)=> {
                            return items.blessRpId === item
                        })[0]
                    }
                )
            });
            // console.log(data);
            this.setState({loadingOther: false, visibleOther: false, blessRpPoolSettings: data});
        }, 1000);
    };
    handleCancel = ()=> {
        this.setState({visible: false});
    };
    handleCancelOther = ()=> {
        this.setState({visibleOther: false});
    };


    componentWillMount() {
        getSuperData()
            .then(({jsonResult}) => {
                // console.log(jsonResult.data);
                this.setState({
                    data: jsonResult.data,
                });
            });
        getBlessData()
            .then(({jsonResult}) => {
                // console.log(jsonResult.data);
                this.setState({
                    dataOther: jsonResult.data,
                });
            });
    }


    onSelectChange = (selectedRowKeys)=> {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys});
    };

    onSelectChangeOther = (selectedRowKeysOther)=> {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeysOther});
    };


    render = ()=> {

        const showConfirm = ()=> {
            let that = this;
            confirm({
                title: '是否删除此红包?',
                content: '删除之后将无法恢复',
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

        const submit = ()=> {
            let num = 0;
            this.state.superRpPoolSettings.forEach((item)=> {
                num = num + parseInt(item.num)
            });
            this.state.blessRpPoolSettings.forEach((item)=> {
                num = num + parseInt(item.num)
            });
            let data = {
                endDayTime: this.state.endDayTime,
                endHourTime: this.state.endHourTime,
                startDayTime: this.state.startDayTime,
                startHourTime: this.state.startHourTime,
                superRpPoolSettings: this.state.superRpPoolSettings,
                blessRpPoolSettings: this.state.blessRpPoolSettings,
                totalNum: num
            };
            console.log(data);
            if (data.superRpPoolSettings.length === 0 || data.blessRpPoolSettings.length === 0) {
              message.error('请将奖池设计完整', 3)
              return false
            }
            if((data.endHourTime && data.endDayTime && data.startHourTime && data.startDayTime
                 && data.totalNum) != '')
            {
                postHourData(data).then(()=> {
                    message.success('保存成功',3);
                    hashHistory.push('/clockLIst')
                }).catch((error)=> {
                    message.error(error, 3)
                })
            }else {
                message.error('请填写所有信息再提交',3)
            }
        };

        const blessBuild = ()=> {
            if (this.state.blessRpPoolSettings.length > 0) {
                return (
                    <span>
                        {this.state.blessRpPoolSettings.map((item, index)=> {
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
                return (
                    <span style={{
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
                )
            }
        };

        const superBuild = ()=> {
            if (this.state.superRpPoolSettings.length > 0) {
                return (
                    <span>
                        {this.state.superRpPoolSettings.map((item, index)=> {
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

        const dateFormat = 'YYYY-MM-DD';
        const dataChange = (data, dateString)=> {
            this.setState({
                startDayTime: dateString[0],
                endDayTime: dateString[1]
            })
        };

        const style = {
            display: 'inline-block',
            width: '155px',
            height: '35px',
            color: 'white',
            textAlign: 'center',
            marginTop: '6px',
            lineHeight: '35px',
            marginLeft: '0px',
            borderRadius: '5px'
        };

        const handleChange = (value)=> {
            this.setState({
                startHourTime: value
            })
        };

        const handleChangeOther = (value)=> {
            this.setState({
                endHourTime: value
            })
        };

        const columns = [{
            title: '奖品名称',
            dataIndex: 'prizeName',
        }, {
            title: '上限剩余',
            dataIndex: 'remain',
        }, {
            title: '输入数量',
            key: 'action',
            render: (text, record) => (
                <Input placeholder={`请输入数量小于${record.remain}`} id={record.superRpId}/>
            ),
        }];

        const columnsOther = [{
            title: '祝福图片',
            dataIndex: 'imageUrl',
            render: (text, record)=>(<img src={text} style={{width: '50px'}}/>)
        }, {
            title: '上限剩余',
            dataIndex: 'upperLimit',
            render: ()=>(<span>无限制</span>)
        }, {
            title: '输入数量',
            key: 'action',
            render: (text, record) => (
                <Input placeholder={`请输入数量`} id={record.blessRpId}/>
            ),
        }];

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const {selectedRowKeysOther} = this.state;
        const rowSelectionOther = {
            selectedRowKeysOther,
            onChange: this.onSelectChangeOther,
        };
        return (
            <div className="pagDetail">
                <p><Link to='/clockList'>放弃</Link></p>
                <p onClick={submit}>保存</p>
                <div className="LaunchDetail">
                    <div className="textContent">
                        <span>选择日期</span>
                        <div style={{height: '46px'}}>
                            <RangePicker
                                placeholder={['开始日期', '结束日期']}
                                format={dateFormat} showToday onChange={dataChange}
                            />
                        </div>
                        <span>选择时段</span>
                        <div>
                            <span style={style}>
                              <Select placeholder="开始时段" style={{width: 155}} onChange={handleChange}>
                                <Option value="00">00:00:00</Option>
                                <Option value="01">01:00:00</Option>
                                <Option value="02">02:00:00</Option>
                                <Option value="03">03:00:00</Option>
                                <Option value="04">04:00:00</Option>
                                <Option value="05">05:00:00</Option>
                                <Option value="06">06:00:00</Option>
                                <Option value="07">07:00:00</Option>
                                <Option value="08">08:00:00</Option>
                                <Option value="09">09:00:00</Option>
                                <Option value="10">10:00:00</Option>
                                <Option value="11">11:00:00</Option>
                                <Option value="12">12:00:00</Option>
                                <Option value="13">13:00:00</Option>
                                <Option value="14">14:00:00</Option>
                                <Option value="15">15:00:00</Option>
                                <Option value="16">16:00:00</Option>
                                <Option value="17">17:00:00</Option>
                                <Option value="18">18:00:00</Option>
                                <Option value="19">19:00:00</Option>
                                <Option value="20">20:00:00</Option>
                                <Option value="21">21:00:00</Option>
                                <Option value="22">22:00:00</Option>
                                <Option value="23">23:00:00</Option>
                              </Select>
                        </span>~
                            <span style={style}>
                                <Select placeholder="结束时段" style={{width: 155}} onChange={handleChangeOther}>
                                <Option value="00">00:00:00</Option>
                                <Option value="01">01:00:00</Option>
                                <Option value="02">02:00:00</Option>
                                <Option value="03">03:00:00</Option>
                                <Option value="04">04:00:00</Option>
                                <Option value="05">05:00:00</Option>
                                <Option value="06">06:00:00</Option>
                                <Option value="07">07:00:00</Option>
                                <Option value="08">08:00:00</Option>
                                <Option value="09">09:00:00</Option>
                                <Option value="10">10:00:00</Option>
                                <Option value="11">11:00:00</Option>
                                <Option value="12">12:00:00</Option>
                                <Option value="13">13:00:00</Option>
                                <Option value="14">14:00:00</Option>
                                <Option value="15">15:00:00</Option>
                                <Option value="16">16:00:00</Option>
                                <Option value="17">17:00:00</Option>
                                <Option value="18">18:00:00</Option>
                                <Option value="19">19:00:00</Option>
                                <Option value="20">20:00:00</Option>
                                <Option value="21">21:00:00</Option>
                                <Option value="22">22:00:00</Option>
                                <Option value="23">23:00:00</Option>
                              </Select>
                            </span></div>
                        <span>奖池设计</span>
                        <div style={{height: 'auto'}}>
                            <span style={{position: 'absolute'}}>
                                超级红包:
                            </span>
                            {superBuild()}<Icon
                            style={{
                                fontSize: '28px',
                                color: '#F06444',
                                marginTop: '10px',
                                position: 'absolute',
                                marginLeft: '5px'
                            }}
                            onClick={this.showModal}
                            type="plus"/>
                        </div>
                        <div style={{height: 'auto'}}>
                            <span style={{position: 'absolute'}}>
                                祝福红包:
                            </span>
                            {blessBuild()}<Icon
                            style={{
                                fontSize: '28px',
                                color: '#F06444',
                                marginTop: '10px',
                                position: 'absolute',
                                marginLeft: '5px'
                            }}
                            onClick={this.showModalOther}
                            type="plus"/>
                        </div>
                    </div>
                </div>
                <Modal
                    visible={this.state.visible}
                    title="添加超级红包"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>放弃</Button>,
                        <Button style={{backgroundColor: '#F06444', borderColor: '#F06444'}} key="submit" type="primary"
                                size="large" loading={this.state.loading} onClick={this.handleOk}>
                            保存
                        </Button>,
                    ]}
                >
                    <div>

                        <Table rowKey={recode => recode.superRpId} rowSelection={rowSelection} columns={columns}
                               dataSource={this.state.data}/>
                    </div>
                </Modal>
                <Modal
                    visible={this.state.visibleOther}
                    title="添加超级红包"
                    onOk={this.handleOkOther}
                    onCancel={this.handleCancelOther}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancelOther}>放弃</Button>,
                        <Button style={{backgroundColor: '#F06444', borderColor: '#F06444'}} key="submit" type="primary"
                                size="large" loading={this.state.loadingOther} onClick={this.handleOkOther}>
                            保存
                        </Button>,
                    ]}
                >
                    <div>

                        <Table rowKey={recode => recode.blessRpId} rowSelection={rowSelectionOther}
                               columns={columnsOther}
                               dataSource={this.state.dataOther}/>
                    </div>
                </Modal>
            </div>
        )
    }
}
