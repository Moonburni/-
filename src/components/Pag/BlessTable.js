import React from 'react'
import { Table, Input, Icon, Button, Popconfirm } from 'antd'
import {Link} from 'react-router'

class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: false,
    };
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    };
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    };
    edit = () => {
        this.setState({ editable: true });
    };
    render() {
        const { value, editable } = this.state;
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

export class EditableTable  extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '祝福语',
            dataIndex: 'name',
            width: '80%',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'name')}
                />
            ),
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return (
                    this.state.dataSource.length > 1 ?
                        (
                            <Popconfirm title="确定删除?" onConfirm={this.onDelete(index)}>
                                <a href="#">删除</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];

        this.state = {
            dataSource: [{
                key: '0',
                name: '请输入祝福语 0',
            }, {
                key: '1',
                name: '请输入祝福语 1',
            }],
            count: 2,
        };
    }
    onCellChange = (index, key) => {
        return (value) => {
            const dataSource = [...this.state.dataSource];
            dataSource[index][key] = value;
            this.setState({ dataSource });
        };
    };
    onDelete = (index) => {
        return () => {
            const dataSource = [...this.state.dataSource];
            dataSource.splice(index, 1);
            this.setState({ dataSource });
        };
    };
    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `请输入祝福语 ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return (<div>
            <div className="btn" style={{marginBottom:'20px'}} onClick={this.handleAdd}>添加红包</div>
            <Table bordered dataSource={dataSource} columns={columns} style={{width:'920px'}}/>
        </div>);
    }
}