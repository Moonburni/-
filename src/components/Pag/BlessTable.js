import React from 'react'
import {Table, Input, Icon, Button, Popconfirm, message,Upload} from 'antd'
import {Link} from 'react-router'
import {getBlessData, delSingleBlessData, postBlessData, putBlessData,getQiNiuToken} from '../Server/Server'
import {qiNiu,qiNiuDomain} from '../../../config'
import cookie from 'js-cookie';

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

    handleChangeOther =(info)=>{
        if (info.file.status === 'done') {
            this.setState({
                value: qiNiuDomain + '/' + info.file.response.key,
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

    render() {
        const {value, editable} = this.state;
        // console.log(value.type);
        if(value.indexOf('http') != -1){
            return (<div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Upload
                                name="file"
                                showUploadList={false}
                                action={qiNiu}
                                onChange={this.handleChangeOther}
                                style={{width:'200px',height:'125px'}}
                                data={this.headersBuilder}
                            >{
                                value ?
                                    <img src={value} style={{width:'200px',height:'125px',cursor:'pointer'}} alt="" className="avatar" /> :
                                    <Icon type="plus" className="avatar-uploader-trigger" />
                            }
                            </Upload>
                            <Icon
                                style={{fontSize:'28px'}}
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />请点击图片修改,修改完毕后请点勾保存
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            <img style={{width:'200px'}} src={value}/>
                            <Icon
                                style={{fontSize:'28px'}}
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
                                style={{fontSize:'28px'}}
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                style={{fontSize:'28px'}}
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
                console.log(jsonResult.data);
                this.setState({
                    dataSource: jsonResult.data,
                    count: jsonResult.data.length,
                    loading:false
                });
            });
        getQiNiuToken()
            .then(({jsonResult}) => {
                // console.log(jsonResult.data.QNToken);
                cookie.set('QNToken',jsonResult.data.QNToken);
            });
    }

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '祝福卡片',
                dataIndex: 'imageUrl',
                width: '20%',
                render: (text, record, index) => (
                    <EditableCell
                        value={text}
                        onChange={this.onCellChangeOther(index, 'imageUrl')}
                    />
                ),
            },
            {
                title: '祝福语',
                dataIndex: 'blessWord',
                width: '60%',
                render: (text, record, index) => (
                    <EditableCell
                        value={text}
                        onChange={this.onCellChange(index, 'blessWord')}
                    />
                ),
            },
            {
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
            console.log(value);
            let data = {imageUrl: value};
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
            console.log(value);
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
            imageUrl:'http://ojlisse1z.bkt.clouddn.com/coverImage/init.png'
        };
        postBlessData(newData).then(
            ({jsonResult})=> {
                this.setState({
                    dataSource: [ jsonResult.data,...dataSource],
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