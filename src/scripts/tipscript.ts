import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.VERCEL_URL;
const API_KEY = process.env.API_KEY;

// Configuração do axios com API key
const axiosConfig = {
 headers: {
    'Content-Type': 'application/json',
    apikey: process.env.REACT_APP_API_KEY,
  },
};

const updateTipStates = async () => {
  console.log("API URL:", API_URL);
  console.log("API KEY exists:", !!API_KEY);
  
  try {
    console.log("Fetching active tip...");
    
    // TIP ATIVA
    const activeTipResponse = await axios.get(`${API_URL}tips`, axiosConfig);
    const activeTip = activeTipResponse.data.data.find(
      (tip: { active: number }) => tip.active === 1
    );

    if (activeTip) {
      console.log(`Deactivating tip ${activeTip.id_tip}...`);
      await axios.put(`${API_URL}tips/${activeTip.id_tip}/state`, {
        active: 0,
      }, axiosConfig);
      console.log(`Deactivated tip ${activeTip.id_tip}.`);
    } else {
      console.log("No active tip found.");
    }

    console.log("Fetching next tip to activate...");
    
    // VAI BUSCAR A PROXIMA TIP
    const nextTipResponse = await axios.get(`${API_URL}tips`, axiosConfig);
    let nextTip = nextTipResponse.data.data.find(
      (tip: { active: number; id_tip: number }) =>
        tip.active === 0 && tip.id_tip > activeTip.id_tip
    );

    // SE NÃO HOUVER UMA TIP COM ID ACIMA
    if (!nextTip) {
      console.log("No next tip found. Activating the first available tip...");
      nextTip = nextTipResponse.data.data.find(
        (tip: { active: number }) => tip.active === 0
      );
      
      if (nextTip) {
        await axios.put(`${API_URL}tips/${nextTip.id_tip}/state`, {
          active: 1,
        }, axiosConfig);
        console.log(`Activated tip ${nextTip.id_tip}.`);
      }
    }
    // SE HOUVER
    else if (nextTip) {
      console.log(`Activating tip ${nextTip.id_tip}...`);
      await axios.put(`${API_URL}tips/${nextTip.id_tip}/state`, {
        active: 1,
      }, axiosConfig);
      console.log(`Activated tip ${nextTip.id_tip}.`);
      
      // Notificação de sucesso
      const notification = await axios.post(
        `${API_URL}admin-notifications/`,
        {
          title: "Dica do dia",
          message: `Dica alterada com sucesso!`,
          source: "tipscript",
          type: "success",
        },
        axiosConfig
      );
    } else {
      console.log("No tips.");
      
      // Notificação de aviso
      const notification = await axios.post(
        `${API_URL}admin-notifications/`,
        {
          title: "Dica do dia",
          message: `Nenhuma dica encontrada.`,
          source: "tipscript",
          type: "warning",
        },
        axiosConfig
      );
    }
  } catch (error: any) {
    console.error(
      "Error updating tips:",
      error.response?.data || error.message
    );
    
    try {
      // Notificação de erro
      const notification = await axios.post(
        `${API_URL}admin-notifications/`,
        {
          title: "Dica do dia",
          message: `Erro ao atualizar dicas: ${error.message}`,
          source: "tipscript",
          type: "error",
        },
        axiosConfig
      );
    } catch (notificationError) {
      console.error("Failed to send error notification:", notificationError);
    }
  }
};

updateTipStates();