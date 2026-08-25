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
// LOGIN
// ==========================================

export const login = async (
    email,
    password
) => {

    const response = await fetch(
        `${API_URL}/Auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );

    const data =
        await parseResponse(response);


    console.log(
        "Login response:",
        response.status,
        data
    );


    if (!response.ok) {

        throw new Error(
            typeof data === "string"
                ? data
                : data?.message ||
                  "Giriş başarısız."
        );
    }


    // ======================================
    // SESSION STORAGE
    // ======================================

    sessionStorage.setItem(
        "token",
        data.token
    );

    sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
    );


    return data;
};


// ==========================================
// REGISTER
// ==========================================

export const register = async (
    name,
    email,
    password
) => {

    const response = await fetch(
        `${API_URL}/Auth/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })
        }
    );

    const data =
        await parseResponse(response);


    console.log(
        "Register response:",
        response.status,
        data
    );


    if (!response.ok) {

        throw new Error(
            typeof data === "string"
                ? data
                : data?.message ||
                  "Kayıt başarısız."
        );
    }


    return data;
};


// ==========================================
// EMAIL VERIFICATION
// ==========================================

export const verifyEmail = async (
    email,
    verificationCode
) => {

    const response = await fetch(
        `${API_URL}/Auth/verify-email`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                verificationCode
            })
        }
    );

    const data =
        await parseResponse(response);


    if (!response.ok) {

        throw new Error(
            typeof data === "string"
                ? data
                : data?.message ||
                  "Email doğrulaması başarısız."
        );
    }


    return data;
};


// ==========================================
// LOGOUT
// ==========================================

export const logout = () => {

    sessionStorage.removeItem(
        "token"
    );

    sessionStorage.removeItem(
        "user"
    );
};


// ==========================================
// TOKEN
// ==========================================

export const getToken = () => {

    return sessionStorage.getItem(
        "token"
    );
};


// ==========================================
// USER
// ==========================================

export const getUser = () => {

    const user =
        sessionStorage.getItem(
            "user"
        );


    if (!user) {
        return null;
    }


    try {

        return JSON.parse(user);

    } catch {

        sessionStorage.removeItem(
            "user"
        );

        return null;
    }
};