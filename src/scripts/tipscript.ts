import axios from "axios";
import dotenv from "dotenv";

import axiosInstance from "../configs/axiosConfig";

dotenv.config();

const API_URL = process.env.VERCEL_URL;

const updateTipStates = async () => {

  console.log ("API URL:", API_URL);
  
  try {
    console.log("Fetching active tip...");
    // TIP ATIVA
    const activeTipResponse = await axiosInstance.get(`${API_URL}tips`);
    const activeTip = activeTipResponse.data.data.find(
      (tip: { active: number }) => tip.active === 1
    );


    if (activeTip) {
      console.log(`Deactivating tip ${activeTip.id_tip}...`);
      await axiosInstance.put(`${API_URL}tips/${activeTip.id_tip}/state`, {
        active: 0,
      });
      console.log(`Deactivated tip ${activeTip.id_tip}.`);
    } else {
      console.log("No active tip found.");
    }

    console.log("Fetching next tip to activate...");
    // VAI BUSCAR A PROXIMA TIP
    // ATIVA A PROXIMA TIP
    const nextTipResponse = await axiosInstance.get(`${API_URL}tips`);
    let nextTip = nextTipResponse.data.data.find(
      (tip: { active: number; id_tip: number }) =>
        tip.active === 0 && tip.id_tip > activeTip.id_tip
    );

    //SE NÃO HOUVER UMA TIP COM ID ACIMA
    if (!nextTip) {
      console.log("No next tip found. Activating the first available tip...");
      nextTip = nextTipResponse.data.data.find(
        (tip: { active: number }) => tip.active === 0
      );
      await axiosInstance.put(`${API_URL}tips/${nextTip.id_tip}/state`, {
        active: 1,
      });
      console.log(`Activated tip ${nextTip.id_tip}.`);
    }
    //SE HOUVER
    else if (nextTip) {
      console.log(`Activating tip ${nextTip.id_tip}...`);
      await axiosInstance.put(`${API_URL}tips/${nextTip.id_tip}/state`, {
        active: 1,
      });
      console.log(`Activated tip ${nextTip.id_tip}.`);

      const notification = await axiosInstance.post(
        "/admin-notifications/",
        {
          title: "Dica do dia",
          message: `Dica alterada com sucesso!`,
          source: "tipscript",
          type: "success",
        }
      );
    } else {
      console.log("No tips.");
      const notification = await axiosInstance.post(
        "/admin-notifications/",
        {
          title: "Dica do dia",
          message: `Nenhuma dica encontrada.`,
          source: "tipscript",
          type: "warning",
        }
      );
    }
  } catch (error: any) {
    console.error(
      "Error updating tips:",
      error.response?.data || error.message
    );
    const notification = await axiosInstance.post(
        "/admin-notifications/",
        {
          title: "Dica do dia",
          message: `Erro ao atualizar dicas: ${error.message}`,
          source: "tipscript",
          type: "error",
        }
      );
  }
};

updateTipStates();
