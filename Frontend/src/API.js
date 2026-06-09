import axios from "axios";

const prodURL = import.meta.env.VITE_PROD_URL?.trim();
const devURL = import.meta.env.VITE_DEV_URL?.trim();

const baseURL = prodURL || devURL || "http://127.0.0.1:8000";

export const API = axios.create({
    baseURL,
    headers: {
        accept: "application/json",
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const detail = error.response?.data?.detail;
        const validationMessage = Array.isArray(detail)
            ? detail
                .map((item) => {
                    const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : "field";
                    return `${field}: ${item.msg}`;
                })
                .join("; ")
            : null;
        const message =
            validationMessage ||
            (typeof detail === "string" ? detail : detail?.message) ||
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

        return Promise.reject({
            ...error,
            message,
        });
    }
);

if (typeof window !== "undefined") {
    window.__CRITIQUE_API_BASE_URL__ = baseURL;
}

export const userLogin = async (email, password) => {
    const response = await API.post("/User/login", {
        email,
        password,
    });

    return response.data;
};

export const userRegister = async (payload) => {
    const response = await API.post("/User/", payload);
    return response.data;
};

export const reviewCode = async ({ language, context, focus, code }) => {
    const response = await API.post("/review/", {
        language: String(language ?? ""),
        context: String(context ?? ""),
        focus: String(focus ?? ""),
        code: String(code ?? ""),
    });

    return response.data;
};

export default API;
