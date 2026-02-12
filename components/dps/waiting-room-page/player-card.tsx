import {User} from 'lucide-react';

const PlayerCard = ({playerName}: { playerName: string }) => {
    return (
        <div className='flex flex-col gap-y-1 text-center justify-center'>
            <div className="w-12 h-12 mx-auto rounded-full bg-muted border border-primary flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground"/>
            </div>
            <p>{playerName}</p>
        </div>
    );
};

export default PlayerCard;