import React, { FC } from 'react';
import { render } from 'react-dom';

const aaa = () => {
    console.log('12345');
    console.log(process.env.NODE_ENV);
};

const App: FC = () => {
    return <div onClick={aaa}>app.tsx content3278238699987dfdflalalalal31</div>;
};

render(<App />, document.getElementById('root'));
