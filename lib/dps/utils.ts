export const clearDPSLocalStorage = () => {
    localStorage.removeItem('dpsPlayerData');
    localStorage.removeItem('dpsPhotonNumber')
    localStorage.removeItem('dpsStep');
    localStorage.removeItem('dpsTab');
    localStorage.removeItem('dpsGameData');
    localStorage.removeItem('dpsDisplayedLines');
    localStorage.removeItem('dpsValidationBitsLength')
}