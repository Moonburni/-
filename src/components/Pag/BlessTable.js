import React from 'react'
import {Table, Input, Icon, Button, Popconfirm, message,Upload} from 'antd'
import {Link} from 'react-router'
import {getBlessData, delSingleBlessData, postBlessData, putBlessData,getQiNiuToken} from '../Server/Server'
import {qiNiu,qiNiuDomain} from '../../../config'

class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: false,
        QNToken:''
    };
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({value});
    };
    check = () => {
        this.setState({editable: false});
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    };
    edit = () => {
        this.setState({editable: true});
    };

    handleChangeOther =()=>{
        if (info.file.status === 'done') {
            this.setState({
                coverImageUrl: qiNiuDomain + '/' + info.file.response.key,
            })
        } else if (info.file.status === 'error') {
            message.error('该文件名已存在，请重命名文件', 3)
        }
    };

    componentWillMount() {
        getQiNiuToken()
            .then(({jsonResult}) => {
                // console.log(jsonResult);
                this.setState({
                    QNToken: jsonResult.data.QNToken
                });
            });
    };

    render() {
        const {value, editable} = this.state;
        const headersBuilder = (file)=> {
            return ({
                token: this.state.QNToken,
                key: 'coverImage/' + file.name
            });
        };

        // console.log(value.type);
        if(value.indexOf('http') != -1){
            return (<div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Upload
                                name="avatar"
                                showUploadList={false}
                                action={qiNiu}
                                onChange={this.handleChangeOther}
                                style={{width:'200px',height:'125px'}}
                                data={headersBuilder}
                            >{
                                value ?
                                    <img src={value} style={{width:'200px',height:'125px',cursor:'pointer'}} alt="" className="avatar" /> :
                                    <Icon type="plus" className="avatar-uploader-trigger" />
                            }
                            </Upload>
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />请点击图片修改
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            <img style={{width:'200px'}} src={value}/>
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>);
        }else{
            return (<div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>);
        }
    }
}

export class EditableTable extends React.Component {

    componentDidMount() {
        getBlessData()
            .then(({jsonResult}) => {
                // console.log(jsonResult.data);
                this.setState({
                    dataSource: jsonResult.data,
                    count: jsonResult.data.length,
                    loading:false
                });
            });
    }

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '',
                dataIndex: 'blessImg',
                width: '20%',
                render: (text, record, index) => (
                    <EditableCell
                        value={'http://4493bz.1985t.com/uploads/allimg/150127/4-15012G52133.jpg'}
                        onChange={this.onCellChangeOther(index, 'blessImg')}
                    />
                ),
            }, {
                title: '祝福语',
                dataIndex: 'blessWord',
                width: '60%',
                render: (text, record, index) => (
                    <EditableCell
                        value={text}
                        onChange={this.onCellChange(index, 'blessWord')}
                    />
                ),
            }, {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                        this.state.dataSource.length > 0 ?
                            (
                                <Popconfirm title="确定删除?" onConfirm={this.onDelete(index)}>
                                    <a href="#">删除</a>
                                </Popconfirm>
                            ) : null
                    );
                },
            }];

        this.state = {
            dataSource: [],
            count: 0,
            loading:true
        };
    }

    onCellChangeOther = (index, key) => {
        return (value) => {
            let data = {blessWord: value};
            putBlessData(this.state.dataSource[index].blessRpId, data).then(
                ()=> {
                    const dataSource = [...this.state.dataSource];
                    dataSource[index][key] = value;
                    this.setState({dataSource});
                }
            );
        };
    };

    onCellChange = (index, key) => {
        return (value) => {
            let data = {blessWord: value};
            putBlessData(this.state.dataSource[index].blessRpId, data).then(
                ()=> {
                    const dataSource = [...this.state.dataSource];
                    dataSource[index][key] = value;
                    this.setState({dataSource});
                }
            );
        };
    };
    onDelete = (index) => {
        return () => {
            delSingleBlessData(this.state.dataSource[index].blessRpId)
                .then(({jsonResult})=> {
                    const dataSource = [...this.state.dataSource];
                    dataSource.splice(index, 1);
                    this.setState({dataSource});
                }).catch((err)=> {
                message.error(err, 3)
            });
        };
    };
    handleAdd = () => {
        const {count, dataSource} = this.state;
        const newData = {
            blessWord: `请输入祝福语`,
        };
        postBlessData(newData).then(
            ({jsonResult})=> {
                this.setState({
                    dataSource: [...dataSource, jsonResult.data],
                    count: count + 1,
                });
            }
        );
    };

    render() {
        const {dataSource} = this.state;
        const columns = this.columns;
        return (<div>
            <div className="btn" style={{marginBottom: '20px'}} onClick={this.handleAdd}>添加红包</div>
            <Table bordered rowKey={recode => recode.blessRpId} dataSource={dataSource} columns={columns}
                   style={{width: '920px'}} loading={this.state.loading}/>
        </div>);
    }
}