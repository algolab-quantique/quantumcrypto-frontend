'use client';

import React from 'react';

type Bb84ButtonProps = {
    onRequestLeave: () => void;
};

const Bb84Button = ({ onRequestLeave }: Bb84ButtonProps) => {
    return (
        <button type="button" onClick={onRequestLeave}>
            <h1 className="font-bold text-4xl text-primary">BB84</h1>
        </button>
    );
};

export default Bb84Button;
