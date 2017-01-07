import React from 'react'
import { Icon,Input,Upload,Select } from 'antd'
import {Link} from 'react-router'
import './pag-super.css'

const Option = Select.Option;

export default class PagChange extends React.Component{

    state = {
        imageUrl:'',
        data: {
            key: '1',
            name: '111',
            time: '111',
            id: '111',
            cover: '',
            content: ''
        }
    };

    handleChange = (info) => {
        if (info.file.status === 'done') {
            this.setState({
                coverImageUrl: qiNiuDomain + '/' + info.file.response.key,
                imageUrl: qiNiuDomain + '/' + info.file.response.key
            })
        } else if (info.file.status === 'error') {
            message.error('该文件名已存在，请重命名文件', 3)
        }
    };

    beforeUpload = (file)=> {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            this.openNotificationWithIcon('error', '图片必须小于2MB!');
        }
        return isLt2M;
    };



    render =()=>{

        let imageUrl = this.state.imageUrl;

        const headersBuilder = (file)=> {
            return ({
                // token: cookie.get('qiNiuToken'),
                key: 'coverImage/' + file.name
            });
        };

        const props = {
            name: 'file',
            action: '/upload.do',
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        return (
            <div>
                <div className="box1Content">
                    <p style={{width: '100%'}}>上传封面<span>（图片建议尺寸120*120）</span></p>
                    <div style={{
                        width: '300px',
                        height: '160px',
                        paddingTop: '18px',
                        clear: 'both',
                        marginBottom: '24px'
                    }}>
                        <Upload
                            className="avatar-uploader"
                            name="file"
                            showUploadList={false}
                            action=''
                            beforeUpload={this.beforeUpload}
                            onChange={this.handleChange}
                            data={headersBuilder}
                        >
                            {
                                imageUrl ?
                                    <img src={`${imageUrl}?imageView2/1/w/300/h/160`} role="presentation"
                                         className="avatar"/> :
                                    <Icon type="plus" className="avatar-uploader-trigger"/>
                            }
                        </Upload>
                    </div>
                    <p>奖品名称</p>
                    <Input placeholder={this.state.data.name} id="name"/>
                    <p>奖品价值</p>
                    <Input placeholder={this.state.data.name} id="price"/>&nbsp;&nbsp;元
                    <p>数量上限</p>
                    <Input placeholder={this.state.data.name}/>
                    <p>赞助商</p>
                    <Input placeholder={this.state.data.name}/>
                    <p>奖品描述</p>
                    <Input placeholder={this.state.data.name}/>
                    <p>奖品类型</p>
                    <Select size="large" defaultValue="0" style={{ width: '150px',height:'36px',marginTop:'24px' }}>
                        <Option value="0">0元购</Option>
                        <Option value="1">1元购</Option>
                        <Option value="10">10元购</Option>
                    </Select>
                    <p>商品URL</p>
                    <Input placeholder={this.state.data.name}/>
                    <p>广告视频</p>
                    <Upload {...props}>
                        <div style={{ cursor:'pointer',border:'solid 1px #eeeeee',width: '150px',height:'36px',marginTop:'24px',textAlign:'center',lineHeight:'36px' }}>
                            <Icon type="upload" /> Click to Upload
                        </div>
                    </Upload>
                </div>
                <div className="pagDetail" style={{overflow:'hidden'}}>
                   <p><Link to={`/superList`}>放弃</Link></p>
                   <p>保存</p>
                </div>
            </div>
        )
    }
}
