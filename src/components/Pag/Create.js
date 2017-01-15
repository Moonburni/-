import React from 'react'
import {Icon, Input, Upload, Select, message} from 'antd'
import {Link} from 'react-router'
import './pag-super.css'
import {postSuperData, getQiNiuToken} from '../Server/Server'
import {hashHistory} from "react-router"
import {qiNiu,qiNiuDomain} from '../../../config'

const Option = Select.Option;


export default class Create extends React.Component {

    state = {
        imageUrl: '',
        prizeType: '',
        QNToken: '',
        coverImageUrl:'',
        adUrl:''
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

    handleChangeOther = (info) => {
        if (info.file.status === 'done') {
            this.setState({
                adUrl:qiNiuDomain + '/' + info.file.response.key
            })
        } else if (info.file.status === 'error') {
            message.error('该文件名已存在，请重命名文件', 3)
        }
    };

    beforeUpload = (file)=> {
        // console.log(this.state.QNToken);
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isLt2M) {
        //     this.openNotificationWithIcon('error', '图片必须小于2MB!');
        // }
        // return isLt2M;
    };


    render = ()=> {

        let imageUrl = this.state.imageUrl;

        const headersBuilder = (file)=> {
            return ({
                token: this.state.QNToken,
                key: 'coverImage/' + file.name
            });
        };

        const headersBuilderOther = (file)=> {
            return ({
                token: this.state.QNToken,
                key: 'photo/' + file.name
            });
        };

        const submit = ()=> {
            let value = {
                adUrl: this.state.adUrl,
                coverImageUrl: this.state.coverImageUrl,
                goodsUrl: document.getElementById('goodsUrl').value,
                description: document.getElementById('description').value,
                price: document.getElementById('price').value,
                prizeName: document.getElementById('prizeName').value,
                prizeType: this.state.prizeType,
                sponsor: document.getElementById('sponsor').value,
                upperLimit: document.getElementById('upperLimit').value
            };
            if ((value.adUrl && value.coverImageUrl && value.description
                && value.goodsUrl && value.price && value.prizeName
                && value.prizeType && value.sponsor && value.upperLimit) != '') {
                postSuperData(value).then(()=> {
                    hashHistory.push('/superList')
                })
            } else {
                message.error('请填写完整信息', 3)
            }
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
                            action={qiNiu}
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
                    <Input placeholder='' id="prizeName"/>
                    <p>奖品价值</p>
                    <Input placeholder='' id="price"/>&nbsp;&nbsp;元
                    <p>数量上限</p>
                    <Input placeholder='' id="upperLimit"/>
                    <p>赞助商</p>
                    <Input placeholder='' id="sponsor"/>
                    <p>奖品描述</p>
                    <Input  type="textarea" rows={4} style={{height:'106px'}} placeholder='' id="description"/>
                    <p>奖品类型</p>
                    <Select size="large" placeholder="请选择奖品类型" onSelect={(value)=> {
                        this.setState({
                            prizeType: value
                        })
                    }}
                            style={{width: '250px', height: '36px', marginTop: '24px'}}>
                        <Option value="0元购">0元购</Option>
                        <Option value="1元购">1元购</Option>
                        <Option value="10元购">10元购</Option>
                    </Select>
                    <p>商品URL</p>
                    <Input type="textarea" rows={4} style={{height:'72px'}} placeholder='' id="goodsUrl"/>
                    <p>广告视频</p>
                    <Upload
                             name="file"
                             showUploadList={true}
                             action={qiNiu}
                             beforeUpload={this.beforeUpload}
                             onChange={this.handleChangeOther}
                             data={headersBuilderOther}>
                        <div style={{
                            cursor: 'pointer',
                            border: 'solid 1px #eeeeee',
                            width: '150px',
                            height: '36px',
                            marginTop: '24px',
                            textAlign: 'center',
                            lineHeight: '36px'
                        }}>
                            <Icon type="upload"/> 点击上传视频
                        </div>
                    </Upload>
                </div>
                <div className="pagDetail" style={{overflow: 'hidden'}}>
                    <p><Link to={`/superList`}>放弃</Link></p>
                    <p onClick={submit}>保存</p>
                </div>
            </div>
        )
    }
}
