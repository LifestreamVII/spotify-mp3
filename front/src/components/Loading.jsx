import React from 'react'

const Loading = ({status}) => {
    return (
        <div className="loading">
            <link rel="stylesheet" href="loading.css" />
            <div className={"inner " + status.type}>
                <div className='scanlines'></div>
                <div className='spinner-cont'>
                    <svg className="spinner" viewBox="0 0 50 50">
                        <circle className="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                    </svg>
                </div>
                <p className="text">{status.status}</p>
            </div>
        </div>
    )
}

export default Loading
