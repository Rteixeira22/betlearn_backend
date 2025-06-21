import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;

// Configuração do axios com API key
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
    apikey: API_KEY,
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

    let currentTipId = 0; // Default para quando não há tip ativa
    
    if (activeTip) {
      console.log(`Deactivating tip ${activeTip.id_tip}...`);
      currentTipId = activeTip.id_tip;
      
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
    const allTips = nextTipResponse.data.data;
    
    // Procura pela próxima tip com ID superior ao atual
    let nextTip = allTips.find(
      (tip: { active: number; id_tip: number }) =>
        tip.active === 0 && tip.id_tip > currentTipId
    );

    // SE NÃO HOUVER UMA TIP COM ID SUPERIOR, VOLTA À PRIMEIRA
    if (!nextTip) {
      console.log("No next tip found with higher ID. Going back to first available tip...");
      
      // Ordena as tips por ID e pega a primeira inativa
      const sortedTips = allTips
        .filter((tip: { active: number }) => tip.active === 0)
        .sort((a: { id_tip: number }, b: { id_tip: number }) => a.id_tip - b.id_tip);
      
      nextTip = sortedTips[0];
    }

    // ATIVA A PRÓXIMA TIP
    if (nextTip) {
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
          message: `Dica ${nextTip.id_tip} alterada com sucesso!`,
          source: "tipscript",
          type: "success",
        },
        axiosConfig
      );
    } else {
      console.log("No tips available to activate.");
      
      // Notificação de aviso
      const notification = await axios.post(
        `${API_URL}admin-notifications/`,
        {
          title: "Dica do dia",
          message: `Nenhuma dica disponível para ativar.`,
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