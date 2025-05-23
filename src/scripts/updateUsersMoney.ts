import axiosInstance from "../configs/axiosConfig";

const UpdateMoney = async () => {
    console.log("Updating users money...");
    
  try {
   console.log("Fetching users...");
    const usersResponse = await axiosInstance.get("users");

    if (usersResponse.status !== 200) {
      throw new Error("Failed to fetch users");
    }

    console.log("Users fetched successfully.");
    const users = usersResponse.data;
    
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
      
      const response = await axiosInstance.patch(`users/${userId}/money`, {
        money: newMoney,
      });
      
      if (response.status !== 200) {
        throw new Error(`Failed to update user ${userId}`);
      }
    
    });
    
    await Promise.all(updatePromises);
    console.log("All users updated successfully.");

    const notification = await axiosInstance.post(
        "/admin-notifications/",
        {
          title: "Atualização de saldo",
          message: `Os saldos dos utilizadores foram atualizados com sucesso!`,
          source: "tipscript",
          type: "success",
        }
      );
 
    } catch (error: any) {
      console.error(
        "Error updating users money:",
        error.response?.data || error.message
      );

      const notification = await axiosInstance.post(
        "/admin-notifications/",
        {
          title: "Atualização de saldo",
          message: `Erro ao atualizar os saldos dos utilizadores.`,
          source: "tipscript",
          type: "error",
        }
      );

  }
};

UpdateMoney();