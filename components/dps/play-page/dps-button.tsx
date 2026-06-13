'use client';

import React from 'react';

type DPSButtonProps = {
    onRequestLeave: () => void;
};

const DPSButton = ({ onRequestLeave }: DPSButtonProps) => {
    return (
        <button type="button" onClick={onRequestLeave} className="text-left">
            <h1 className="font-bold text-4xl text-primary">DPS</h1>
        </button>
    );
};

export default DPSButton;
