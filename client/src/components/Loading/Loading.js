import React from 'react';
import ReactLoading from 'react-loading';
import './loading.css';

export default function Loading({type, color}) {

    const [message, setMessage] = React.useState('Wait a second');
    let timer1;
    let timer2;
    
    const toggleMessage = () => {
        timer1 = setTimeout(()=> { setMessage('Seems to be same problems'); }, 3000);
        timer2 = setTimeout(()=> { setMessage('Try to reconnect later'); }, 8000);
    }

    React.useEffect(() => {
        // this will clear Timeout when component unmount like in willComponentUnmount
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2)
        }
      },[timer1, timer2] //useEffect will run only one time
    )

    return (
      <div className="App" onLoad={toggleMessage}>
        <header className="App-header">
          <img src="/images/svg/loading.svg" className="App-logo" alt="logo" />
          <p>
            {message}
          </p>
          <ReactLoading type={type} color={color} height={'20%'} width={'10%'} />
        </header>
      </div>
    );
}