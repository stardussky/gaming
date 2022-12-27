import axios from "axios";

let axiosInstance;

const createAxios = () => {
  const instance = axios.create({
    baseURL: "https://shl.13api.me/",
  });

  instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use((response) => response, (error) => Promise.reject(error));

  return instance;
};

if (!axiosInstance) {
  axiosInstance = createAxios();
}

export default axiosInstance;
