import React from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';
import styles from './guardianInfoHistory.module.css';

class GuardianInfoHistory extends React.Component {

    state = {
        entranceHistory: [],
        test: undefined
    }

    componentDidMount = async () => {
        console.log('componentDidMount!');
        try {            
            const res = await axios.get('/api/entrancehistory', {
                params: {
                    limit: 5
                }
            });
            console.log('res:', res);
            if (res.data.result && res.data.result.length > 0) {
                this.setState({
                    entranceHistory: res.data.result
                });
            }

            // fetch('/api/image')
            // .then(response => response.blob())
            // .then(myBlob => {                                
            //     const objectUrl = window.URL.createObjectURL(myBlob);
            //     this.setState({ test: objectUrl });
            // });
            

            // fetch('/api/image')
            // .then(response => response.blob())
            // .then((blob) => {
            //     const objectUrl = URL.createObjectURL(blob);
            //     this.setState({ test: objectUrl });
            // });

        } catch(error) {
            console.log('error:', error);
        }
    }

    render() {
        return (
            <div className='contents'>
                <div className='contents-wrapper'>
                    {/* {JSON.stringify(this.state.entranceHistory, null, 2)} */}
                    {/* <img className='delayimg' src={this.state.test} alt='zzz' width="800" height="600" /> */}
                    <Table className={styles.Table} dark striped hover size="sm">
                        <thead>
                            <tr>
                                <th className={styles.TableNo}>번호</th>
                                <th className={styles.TableName}>이름</th>
                                <th className={styles.TableTime}>출입일시</th>
                                <th>승인여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.entranceHistory.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.LogIDX}</td>
                                    <td>{item.LogPersonLastName}</td>
                                    <td>{item.LogDate+' '+item.LogTime}</td>
                                    <td>{item.LogStatusName}</td>
                                </tr>
                            ))}                            
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

export default GuardianInfoHistory;