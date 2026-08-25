const API_URL = "https://localhost:7071/api";


// ==========================================
// RESPONSE PARSER
// ==========================================

const parseResponse = async (response) => {

    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};


// ==========================================
// API REQUEST
// ==========================================

const apiRequest = async (
    endpoint,
    options = {}
) => {

    const token =
        sessionStorage.getItem("token");


    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };


    // ======================================
    // JWT
    // ======================================

    if (token) {

        headers.Authorization =
            `Bearer ${token}`;
    }


    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );


    const data =
        await parseResponse(response);


    // ======================================
    // 401
    // ======================================

    if (response.status === 401) {

        throw new Error(
            "Oturum geçersiz veya süresi dolmuş."
        );
    }


    // ======================================
    // 403
    // ======================================

    if (response.status === 403) {

        throw new Error(
            "Bu işlem için yetkiniz bulunmuyor."
        );
    }


    // ======================================
    // OTHER ERRORS
    // ======================================

    if (!response.ok) {

        throw new Error(
            typeof data === "string"
                ? data
                : data?.message ||
                  "API isteği başarısız."
        );
    }


    return data;
};


export default apiRequest;