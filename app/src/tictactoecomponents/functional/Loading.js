
import React from 'react';

const Loading = ({loading}) => {
    return (
        <div className="loader" style={{display:loading?'flex':'none'}}>
            <i className="fa fa-spinner fa-pulse fa-4x fa-fw"></i>
            <span style={{userSelect: 'none'}}></span>
        </div>
    );
}

export default Loading;