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

const UpdateMoney = async () => {

  console.log("Updating users money...");
  try {
    console.log("Fetching users...");
    const usersResponse = await axios.get(`${API_URL}users`, axiosConfig);
    if (usersResponse.status !== 200) {
      throw new Error("Failed to fetch users");
    }
    console.log("Users fetched successfully.");
    const users = usersResponse.data.data;
    console.log("Updating users money...");
    const updatePromises = users.map(async (user: any) => {
      const userId = user.id_user;
      const money = parseInt(user.money || "0", 10);
      const addValue = parseInt(user.QuestionnaireResponse[0]?.budget || "0", 10);
      if (isNaN(addValue)) {
        console.log(`No valid addValue found for user ${userId}. Skipping...`);
        return;
      }
      const newMoney = money + addValue;
      const response = await axios.patch(`${API_URL}users/${userId}/money`, {
        money: newMoney,
      }, axiosConfig);
      if (response.status !== 200) {
        throw new Error(`Failed to update user ${userId}`);
      }
    });
    await Promise.all(updatePromises);
    console.log("All users updated successfully.");
    const notification = await axios.post(
      `${API_URL}admin-notifications/`,
      {
        title: "Atualização de saldo",
        message: `Os saldos dos utilizadores foram atualizados com sucesso!`,
        source: "tipscript",
        type: "success",
      },
      axiosConfig
    );
  } catch (error: any) {
    console.error(
      "Error updating users money:",
      error.response?.data || error.message
    );
    const notification = await axios.post(
      `${API_URL}admin-notifications/`,
      {
        title: "Atualização de saldo",
        message: `Erro ao atualizar os saldos dos utilizadores.`,
        source: "tipscript",
        type: "error",
      },
      axiosConfig
    );
  }
};
UpdateMoney();