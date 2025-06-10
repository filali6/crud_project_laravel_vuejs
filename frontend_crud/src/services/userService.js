import Axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users";  

export const getAllUsers = async () => {
  try {
    const response = await Axios.get(API_URL);
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
    const response = await Axios.get(`${API_URL}/${id}`);
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
    const response = await Axios.post(API_URL, userData);
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
    const response = await Axios.patch(`${API_URL}/${id}`, userData);
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
    const response = await Axios.delete(`${API_URL}/${id}`);
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
