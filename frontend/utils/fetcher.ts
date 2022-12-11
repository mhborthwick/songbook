import axios from "axios";

const fetcher = async <T>(url: string, headers = {}): Promise<T | null> => {
  try {
    const res = await axios.get<T>(url, { headers, withCredentials: true });
    return res.data;
  } catch (err) {
    return null;
  }
};

export default fetcher;
