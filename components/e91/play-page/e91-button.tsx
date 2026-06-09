'use client';

import React from 'react';

type E91ButtonProps = {
    onRequestLeave: () => void;
};

const E91Button = ({ onRequestLeave }: E91ButtonProps) => {
    return (
        <button type="button" onClick={onRequestLeave} className="text-left">
            <h1 className="font-bold text-4xl text-primary">E91</h1>
        </button>
    );
};

export default E91Button;
