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
// AUTH HEADERS
// ==========================================

const getAuthHeaders = () => {

    const token =
        sessionStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
};


// ==========================================
// TÜM KULLANICILARI GETİR
// ==========================================

export const getUsers = async () => {

    const response = await fetch(
        `${API_URL}/User`,
        {
            method: "GET",
            headers: getAuthHeaders()
        }
    );

    const data =
        await parseResponse(response);


    if (!response.ok) {

        if (response.status === 401) {

            throw new Error(
                "Yetkilendirme başarısız. Oturumunuz geçersiz veya süresi dolmuş."
            );
        }

        if (response.status === 403) {

            throw new Error(
                "Bu işlem için yetkiniz bulunmuyor."
            );
        }

        throw new Error(
            typeof data === "string"
                ? data
                : data?.message ||
                  "Kullanıcılar alınamadı."
        );
    }


    return data || [];
};


// ==========================================
// ROL DEĞİŞTİR
// ==========================================

export const changeUserRole = async (
    userId,
    role
) => {

    const response = await fetch(
        `${API_URL}/User/${userId}/role`,
        {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(role)
        }
    );

    const data =
        await parseResponse(response);


    if (!response.ok) {

        if (response.status === 401) {
            throw new Error(
                "Oturum geçersiz."
            );
        }

        if (response.status === 403) {
            throw new Error(
                "Bu işlem için Admin yetkisi gerekiyor."
            );
        }

        throw new Error(
            typeof data === "string"
                ? data
                : data?.message ||
                  "Kullanıcı rolü değiştirilemedi."
        );
    }


    return data;
};


// ==========================================
// BANLA
// ==========================================

export const banUser = async (
    userId
) => {

    const response = await fetch(
        `${API_URL}/User/${userId}/ban`,
        {
            method: "PUT",
            headers: getAuthHeaders()
        }
    );

    const data =
        await parseResponse(response);


    if (!response.ok) {

        if (response.status === 401) {
            throw new Error(
                "Oturum geçersiz."
            );
        }

        if (response.status === 403) {
            throw new Error(
                "Bu işlem için Admin yetkisi gerekiyor."
            );
        }

        throw new Error(
            typeof data === "string"
                ? data
                : data?.message ||
                  "Kullanıcı banlanamadı."
        );
    }


    return data;
};


// ==========================================
// BAN KALDIR
// ==========================================

export const unbanUser = async (
    userId
) => {

    const response = await fetch(
        `${API_URL}/User/${userId}/unban`,
        {
            method: "PUT",
            headers: getAuthHeaders()
        }
    );

    const data =
        await parseResponse(response);


    if (!response.ok) {

        if (response.status === 401) {
            throw new Error(
                "Oturum geçersiz."
            );
        }

        if (response.status === 403) {
            throw new Error(
                "Bu işlem için Admin yetkisi gerekiyor."
            );
        }

        throw new Error(
            typeof data === "string"
                ? data
                : data?.message ||
                  "Kullanıcının banı kaldırılamadı."
        );
    }


    return data;
};