import axios from "axios";
import { GAME_ID_EVENT }from '@/e91-constants';



export const recordGameStats = async (protocolType, playersCount, options = {}) => {
  const { silent = false } = options;

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/record_game_statistic/`, {
      protocol_type: protocolType,
      players_count: playersCount,
    });
    return response.data;
  } catch (error) {
    if (!silent) {
      console.error("Error recording game stats:", error);
      throw error;
    }

    return null;
  }
};

export const recordIPAddress = async (gameId) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/record_player_ip/`, { game_id: gameId });

    return response.data;
  } catch (error) {
    console.error("Error adding IP address:", error);
    throw error;
  }
};
