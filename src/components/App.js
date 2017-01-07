import React from 'react'
import Header from './Header/Header'
import Side from './Side/Side'


export default class App extends React.Component{

    render =()=>{
        const style = {
            position:'absolute',
            top:'60px',
            left:'200px',
            width:'calc(100% - 200px)',
            backgroundColor:'#ecf2f6',
        };
        const styles = {
            width:'1000px',
            margin:'auto',
            paddingTop:'30px',
            backgroundColor:'#ffffff'
        };
        return (
            <div>
               <Header/>
               <Side/>
                <div style={style}>
                    <div style={styles}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}