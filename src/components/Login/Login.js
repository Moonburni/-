import React from 'react'
import './login.css'
import { Form, Icon, Input, Button } from 'antd';
import {hashHistory} from "react-router";


const FormItem = Form.Item;

export default class Login extends React.Component{

    handleSubmit =(e)=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                hashHistory.push('/send')
            }
        });
    };

    render =()=>{
        const { getFieldDecorator } = this.props.form;
        const style = {
            width:'250px',
            height:'50px',
            fontSize:'18px',
            color:'#333333',
            backgroundColor:'white',
            paddingLeft:'24px'
        };
        const btn = {
            width:'319px',
            height:'50px',
            fontSize:'18px',
            color:'#ffffff',
            backgroundColor:'#F06444',
            borderColor:'#F06444',
            marginTop:'30px'
        };
        const icon = {
            width:'50px',
            fontSize:'24px'
        };
        return (
            <div>
               <header>赢面AR红包管理后台</header>
                <div className="login-main">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator('adminName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input style={style} addonBefore={<Icon type="user" style={icon}/>} placeholder="请输入用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input style={style} addonBefore={<Icon type="lock" style={icon}/>} type="password" placeholder="请输入密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" style={btn} htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

Login = Form.create({})(Login);