import Axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";  


export const login= async ({ email, password }) => {
  try {
    const res = await Axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    const { token,user} = res.data;  

    
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user)); 

    console.log("Login réussi, token stocké");
    return res.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error);
    throw error;
  }
};
export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      await Axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
     
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    console.log("Logout completed");
  }
};
export const registerUser = async ({ name, email, password }) => {
  try {
    const res = await Axios.post(`${API_URL}/register/user`, {
      name,
      email,
      password,
    });

    const { token } = res.data;
    localStorage.setItem("token", token);
    console.log("User enregistré et connecté:", res.data); 
    return res.data;
  } catch (error) {
    console.error("Register user failed:", error.response?.data || error);
    throw error;
  }
};