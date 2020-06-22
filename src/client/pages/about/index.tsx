import React from 'react';
import { useHistory } from 'react-router-dom';

const about: React.FC = () => {
    const history = useHistory();
    return (
        <div>
            <p>this is about page</p>
            <p
                onClick={() => {
                    history.push('/');
                }}
            >
                click me goto home(use history)
            </p>
        </div>
    );
};

export default about;
