import axios from "axios";

export const getClientInfo = async () => {
  try {
    const ipResponse = await axios.get("https://api.ipify.org?format=json");
    return ipResponse.data.ip;
  } catch (error) {
    console.error("Error fetching client info:", error);
    return null;
  }
};
