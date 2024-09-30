import axios from "axios"

const URL_API = import.meta.env.VITE_API_URL;
export const registerService = async ({ username, email, password, role }) => {
  try {
    const results = await axios.post(URL_API + '/auth/signup', { username, email, password, role });
    return results.data;
  }
  catch (error) {
    if (error.code == "ERR_NETWORK") {
      throw new Error("Error de red");
    }
    throw new Error(error.response.data.message[0].msg || error.response.data.message || error);
  }
}