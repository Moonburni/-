import React from 'react'



export default class Super extends React.Component{

    render =()=>{

        return(
            <div>
                {this.props.children}
            </div>
        )
    }
}
