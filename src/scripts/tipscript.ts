import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.VERCEL_URL;

const updateTipStates = async () => {
  try {
    console.log("Fetching active tip...");
    // TIP ATIVA
    const activeTipResponse = await axios.get(`${API_URL}tips`);
    const activeTip = activeTipResponse.data.find(
      (tip: { active: number }) => tip.active === 1
    );

    if (activeTip) {
      console.log(`Deactivating tip ${activeTip.id_tip}...`);
      await axios.put(`${API_URL}tips/${activeTip.id_tip}/state`, {
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
    let nextTip = nextTipResponse.data.find(
      (tip: { active: number; id_tip: number }) =>
        tip.active === 0 && tip.id_tip > activeTip.id_tip
    );

    //SE NÃO HOUVER UMA TIP COM ID ACIMA
    if (!nextTip) {
      console.log("No next tip found. Activating the first available tip...");
      nextTip = nextTipResponse.data.find(
        (tip: { active: number }) => tip.active === 0
      );
      await axios.put(`${API_URL}tips/${nextTip.id_tip}/state`, {
        active: 1,
      });
      console.log(`Activated tip ${nextTip.id_tip}.`);
    }
    //SE HOUVER
    else if (nextTip) {
      console.log(`Activating tip ${nextTip.id_tip}...`);
      await axios.put(`${API_URL}tips/${nextTip.id_tip}/state`, {
        active: 1,
      });
      console.log(`Activated tip ${nextTip.id_tip}.`);
    } else {
      console.log("No tips.");
    }
  } catch (error: any) {
    console.error(
      "Error updating tips:",
      error.response?.data || error.message
    );
  }
};

updateTipStates();
