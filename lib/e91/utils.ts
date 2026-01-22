export const clearE91LocalStorage = () => {
    localStorage.removeItem('e91PlayerData');
    localStorage.removeItem('e91PhotonNumber');
    localStorage.removeItem('e91Step');
    localStorage.removeItem('e91Tab');
    localStorage.removeItem('e91GameData');
    localStorage.removeItem('e91DisplayedLines');
    localStorage.removeItem('e91ValidationBitsLength');
    localStorage.removeItem('e91GameHasEve');
    localStorage.removeItem('e91GameStartTime'); // Clear game timer for new games
    localStorage.removeItem('e91OriginalEvePresent'); // Clear original Eve state
    localStorage.removeItem('e91EveWasDetected'); // Clear Eve detection flag
}