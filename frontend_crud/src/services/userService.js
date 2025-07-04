import Axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users"; 
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 

export const getAllUsers = async () => {
  try {
    const response = await Axios.get(`${API_URL}`, {
      headers: getAuthHeaders(), 
    });
    console.log("Utilisateurs récupérés:", response.data);
    return response.data;  
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des utilisateurs:",
      error.response?.data || error
    );
    throw error;
  }
};




export const getUserById = async (id) => {
  try {
    const response = await Axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeaders(), // ← Ajouter le token
    });
    console.log("Utilisateur récupéré:", response.data);
    return response.data;  
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'utilisateur ${id}:`,
      error.response?.data || error
    );
    throw error;
  }
}; 






export const createUser = async (userData) => {
  try {
    const response = await Axios.post(API_URL, userData, {
      headers: getAuthHeaders()  // ← Ajouter le token
    });
    console.log("Utilisateur créé:", response.data);
    return response.data;  
  } catch (error) {
    console.error(
      "Erreur lors de la création de l'utilisateur:",
      error.response?.data || error
    );
    throw error;
  }
}; 






export const updateUser = async (id, userData) => {
  try {
    const response = await Axios.patch(`${API_URL}/${id}`, userData, {
      headers: getAuthHeaders(), // ← Ajouter le token
    });
    console.log("Utilisateur mis à jour:", response.data);
    return response.data;  
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'utilisateur ${id}:`,
      error.response?.data || error
    );
    throw error;
  }
};




export const deleteUser = async (id) => {
  try {
    const response = await Axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(), // ← Ajouter le token
    });
    console.log("Utilisateur supprimé");
    return response.data;  
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'utilisateur ${id}:`,
      error.response?.data || error
    );
    throw error;
  }
};
export const sendMessage = async (messageText) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token manquant");
    }

    const response = await Axios.post(
      `http://127.0.0.1:8000/api/chat/send-message`,
      {
        message: messageText.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(" Erreur envoi message:", error);
    throw error;
  }
};
