import {Avatar} from '@nextui-org/react';

const PlayerCard = ({playerName}: { playerName: string }) => {
    return (
        <div className='flex flex-col gap-y-1 text-center justify-center'>
            <div className="w-12 h-12 mx-auto rounded-full bg-transparent border border-primary">
                <Avatar className="w-12 h-12" size="md"/>
            </div>
            <p>{playerName}</p>
        </div>
    );
};

export default PlayerCard;