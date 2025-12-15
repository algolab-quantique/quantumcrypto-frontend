import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerStore {
    playerName: string;
    playerId: number | null;
    playerRole: string;
    playingSolo: boolean;
    playingMultiplayer: boolean;  // NEW: Track multiplayer session for page refresh
    isAdmin: boolean;
    partner: string;
    setPlayerName: (playerName: string) => void;
    setPlayerId: (playerName: number) => void;
    setPlayerRole: (role: string) => void;
    setPlayingSolo: (playingSolo: boolean) => void;
    setPlayingMultiplayer: (playingMultiplayer: boolean) => void;  // NEW
    setIsAdmin: (isAdmin: boolean) => void;
    setPartner: (partner: string) => void;
    resetPlayer: () => void;
}

const usePlayerStore = create<PlayerStore>()(
    persist(
        (set) => ({
            playerName: '',
            playerId: null,
            playerRole: 'A',
            playingSolo: false,
            playingMultiplayer: false,  // NEW
            isAdmin: false,
            partner: '',
            setPlayerName: (playerName) => set({ playerName: playerName }),
            setPlayerId: (playerId) => set({ playerId: playerId }),
            setPlayerRole: (role) => set({ playerRole: role }),
            setPlayingSolo: (playingSolo) => set({ playingSolo: playingSolo }),
            setPlayingMultiplayer: (playingMultiplayer) => set({ playingMultiplayer: playingMultiplayer }),  // NEW
            setIsAdmin: (isAdmin) => set({ isAdmin: isAdmin }),
            setPartner: (partner) => set({ partner }),
            resetPlayer: () => set({
                playerName: '',
                playerId: null,
                playerRole: 'A',
                playingSolo: false,
                playingMultiplayer: false,  // NEW
                isAdmin: false,
                partner: '',
            }),
        }),
        {
            name: 'player-storage', // localStorage key
        }
    )
);

export default usePlayerStore;