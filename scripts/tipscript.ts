const axios = require("axios");
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_VERCEL_URL;

const updateTipStates = async () => {
    try {
        console.log("Fetching active tip...");
        // TIP ATIVA
        const activeTipResponse = await axios.get(`${API_URL}tips`);
        const activeTip = activeTipResponse.data.find((tip) => tip.active === 1);

        if (activeTip) {
            console.log(`Deactivating tip ${activeTip.id_tip}...`);
            await axios.put(`${API_URL}tips/${activeTip.id_tip}`, {
                active: 0,
            });
            console.log(`Deactivated tip ${activeTip.id_tip}.`);
        } else {
            console.log("No active tip found.");
        }

        console.log("Fetching next tip to activate...");
        // VAI BUSCAR A PROXIMA TIP
        // ATIVA A PROXIMA TIP
        const nextTipResponse = await axios.get(`${API_URL}tips`);
        const nextTip = nextTipResponse.data.find((tip) => tip.active === 0);

        if (nextTip) {
            console.log(`Activating tip ${nextTip.id_tip}...`);
            await axios.put(`${API_URL}tips/${nextTip.id_tip}`, {
                active: 1,
            });
            console.log(`Activated tip ${nextTip.id_tip}.`);
        } else {
            console.log("No tips.");
        }
    } catch (error) {
        console.error("Error updating tips:", error.response?.data || error.message);
    }
};

updateTipStates();