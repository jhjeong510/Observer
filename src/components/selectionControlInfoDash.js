import React from 'react';

class SelectionControlInfoDash extends React.Component {

    render() {
        return (
            <div className='card'>
                <div className='card-wrapper'>
                    {this.props.selectioncontrolurl && this.props.selectioncontrolurl.map(item => {
                        return <img src={item} width='145px' height='100px' alt=''/>
                    })}                    
                    {/* <img src='http://포항cctv.com/wp-content/uploads/2016/07/%EB%8F%84%EB%A1%9C%EC%84%A4%EC%B9%98%ED%99%94%EB%A9%B41.jpg' width='145px' height='100px' alt=''/>
                    <img src='https://lh3.googleusercontent.com/proxy/RR6nZ02MGMxwM5jdQ3fx3TbRcBCzE2rOWmaOAFPvSpjZfaoINaWpcDX0ppehwUbXSBFmYsZOXBKqEVOq12cKU-N3syVvpUlTW7nFEUVhBGapiOpM53BSXNwu4_lV6A' width='145px' height='100px' alt=''/>
                    <img src='http://포항cctv.com/wp-content/uploads/2016/07/%EB%8F%84%EB%A1%9C%EC%84%A4%EC%B9%98%ED%99%94%EB%A9%B41.jpg' width='145px' height='100px' alt=''/>
                    <img src='https://lh3.googleusercontent.com/proxy/RR6nZ02MGMxwM5jdQ3fx3TbRcBCzE2rOWmaOAFPvSpjZfaoINaWpcDX0ppehwUbXSBFmYsZOXBKqEVOq12cKU-N3syVvpUlTW7nFEUVhBGapiOpM53BSXNwu4_lV6A' width='145px' height='100px' alt=''/> */}
                </div>
            </div>
        )
    }
}

export default SelectionControlInfoDash;