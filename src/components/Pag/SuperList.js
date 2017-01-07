import React from 'react'
import { Table } from 'antd'
import {Link} from 'react-router'


export default class SuperList extends React.Component{
    render =()=>{

        const dataSource = [{
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
            id:11
        }];

        const columns = [{
            title: '奖品名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '奖品描述',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: '上限',
            dataIndex: 'address',
            key: 'address',
        },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                   <Link to={`/pagDetail${record.id}`}>查看</Link>
                   <span className="ant-divider" />
                   <Link to={`/pagChange${record.id}`}>编辑</Link>
                   <span className="ant-divider" />
                   <a>删除</a>
                </span>
            ),
        }];

        return (
            <div>
                <Link to="/create"><div className="btn">添加红包</div></Link>
                <div style={{width:'920px',marginTop:'20px'}}>
                    <Table dataSource={dataSource} columns={columns} bordered />
                </div>
            </div>
        )
    }
}
