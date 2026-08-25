import { useState } from "react";


const API_URL =
    "https://localhost:7071/api/Auth";


function ForgotPassword({
    onBackToLogin
}) {

    // ==========================================
    // STEP
    // ==========================================

    const [step, setStep] =
        useState(1);


    // ==========================================
    // FORM STATES
    // ==========================================

    const [email, setEmail] =
        useState("");

    const [resetCode, setResetCode] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    // ==========================================
    // UI STATES
    // ==========================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // PASSWORD RESET CODE REQUEST
    // ==========================================

    const handleSendCode = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");

        setLoading(true);


        try {

            const response =
                await fetch(
                    `${API_URL}/forgot-password`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email
                        })
                    }
                );


            const text =
                await response.text();


            let data = {};

            try {

                data =
                    text
                        ? JSON.parse(text)
                        : {};

            } catch {

                data = {
                    message:
                        text
                };

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Şifre sıfırlama kodu gönderilemedi."
                );

            }


            setSuccess(
                "Şifre sıfırlama kodu e-mail adresinize gönderildi."
            );

            setStep(2);

        } catch (error) {

            console.error(
                "Reset kodu gönderme hatası:",
                error
            );

            setError(
                error.message ||
                "Bir hata oluştu."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    const handleResetPassword = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");


        // Şifre kontrolü

        if (
            newPassword !==
            confirmPassword
        ) {

            setError(
                "Şifreler eşleşmiyor."
            );

            return;
        }


        if (newPassword.length < 6) {

            setError(
                "Şifre en az 6 karakter olmalıdır."
            );

            return;
        }


        setLoading(true);


        try {

            const response =
                await fetch(
                    `${API_URL}/reset-password`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            email,

                            resetCode,

                            newPassword

                        })
                    }
                );


            const text =
                await response.text();


            let data = {};

            try {

                data =
                    text
                        ? JSON.parse(text)
                        : {};

            } catch {

                data = {
                    message:
                        text
                };

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Şifre değiştirilemedi."
                );

            }


            setSuccess(
                "Şifreniz başarıyla değiştirildi."
            );


            setTimeout(() => {

                if (onBackToLogin) {

                    onBackToLogin();

                }

            }, 1500);

        } catch (error) {

            console.error(
                "Şifre değiştirme hatası:",
                error
            );

            setError(
                error.message ||
                "Bir hata oluştu."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#111318",
                color: "#ffffff"
            }}
        >

            <div
                style={{
                    width: "400px",
                    padding: "40px",
                    borderRadius: "12px",
                    backgroundColor: "#1b1e24",
                    boxShadow:
                        "0 10px 30px rgba(0, 0, 0, 0.4)"
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "10px"
                    }}
                >
                    Şifre Sıfırlama
                </h1>


                {/* ==================================
                    STEP 1
                ================================== */}

                {step === 1 && (

                    <form
                        onSubmit={
                            handleSendCode
                        }
                    >

                        <p
                            style={{
                                textAlign:
                                    "center",
                                color:
                                    "#aaa",
                                marginBottom:
                                    "25px"
                            }}
                        >
                            Hesabınıza kayıtlı
                            e-mail adresinizi
                            girin.
                        </p>


                        <label>
                            E-mail
                        </label>


                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            placeholder="E-mail adresiniz"
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
                                marginBottom: "20px",
                                boxSizing:
                                    "border-box",
                                borderRadius: "6px",
                                border:
                                    "1px solid #444",
                                backgroundColor:
                                    "#252932",
                                color:
                                    "#ffffff",
                                fontSize: "15px"
                            }}
                        />


                        {error && (

                            <div
                                style={{
                                    marginBottom:
                                        "20px",
                                    padding:
                                        "10px",
                                    borderRadius:
                                        "6px",
                                    backgroundColor:
                                        "#3a1f1f",
                                    color:
                                        "#ff6b6b",
                                    textAlign:
                                        "center"
                                }}
                            >
                                {error}
                            </div>

                        )}


                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding:
                                    "12px",
                                border:
                                    "none",
                                borderRadius:
                                    "6px",
                                backgroundColor:
                                    "#646cff",
                                color:
                                    "#ffffff",
                                fontSize:
                                    "16px",
                                fontWeight:
                                    "bold",
                                cursor:
                                    "pointer"
                            }}
                        >

                            {loading
                                ? "Gönderiliyor..."
                                : "Kod Gönder"}

                        </button>

                    </form>

                )}


                {/* ==================================
                    STEP 2
                ================================== */}

                {step === 2 && (

                    <form
                        onSubmit={
                            handleResetPassword
                        }
                    >

                        <p
                            style={{
                                textAlign:
                                    "center",
                                color:
                                    "#aaa",
                                marginBottom:
                                    "25px"
                            }}
                        >
                            E-mail adresinize
                            gönderilen 6 haneli
                            kodu ve yeni
                            şifrenizi girin.
                        </p>


                        {/* RESET CODE */}

                        <label>
                            Doğrulama Kodu
                        </label>


                        <input
                            type="text"
                            value={resetCode}
                            onChange={(e) =>
                                setResetCode(
                                    e.target.value
                                )
                            }
                            placeholder="6 haneli kod"
                            maxLength={6}
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
                                marginBottom: "20px",
                                boxSizing:
                                    "border-box",
                                borderRadius:
                                    "6px",
                                border:
                                    "1px solid #444",
                                backgroundColor:
                                    "#252932",
                                color:
                                    "#ffffff",
                                fontSize:
                                    "15px"
                            }}
                        />


                        {/* NEW PASSWORD */}

                        <label>
                            Yeni Şifre
                        </label>


                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Yeni şifreniz"
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
                                marginBottom: "20px",
                                boxSizing:
                                    "border-box",
                                borderRadius:
                                    "6px",
                                border:
                                    "1px solid #444",
                                backgroundColor:
                                    "#252932",
                                color:
                                    "#ffffff",
                                fontSize:
                                    "15px"
                            }}
                        />


                        {/* CONFIRM PASSWORD */}

                        <label>
                            Yeni Şifre Tekrar
                        </label>


                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Yeni şifreniz tekrar"
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
                                marginBottom: "20px",
                                boxSizing:
                                    "border-box",
                                borderRadius:
                                    "6px",
                                border:
                                    "1px solid #444",
                                backgroundColor:
                                    "#252932",
                                color:
                                    "#ffffff",
                                fontSize:
                                    "15px"
                            }}
                        />


                        {error && (

                            <div
                                style={{
                                    marginBottom:
                                        "20px",
                                    padding:
                                        "10px",
                                    borderRadius:
                                        "6px",
                                    backgroundColor:
                                        "#3a1f1f",
                                    color:
                                        "#ff6b6b",
                                    textAlign:
                                        "center"
                                }}
                            >
                                {error}
                            </div>

                        )}


                        {success && (

                            <div
                                style={{
                                    marginBottom:
                                        "20px",
                                    padding:
                                        "10px",
                                    borderRadius:
                                        "6px",
                                    backgroundColor:
                                        "#1f3a29",
                                    color:
                                        "#6bff9c",
                                    textAlign:
                                        "center"
                                }}
                            >
                                {success}
                            </div>

                        )}


                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding:
                                    "12px",
                                border:
                                    "none",
                                borderRadius:
                                    "6px",
                                backgroundColor:
                                    "#646cff",
                                color:
                                    "#ffffff",
                                fontSize:
                                    "16px",
                                fontWeight:
                                    "bold",
                                cursor:
                                    "pointer"
                            }}
                        >

                            {loading
                                ? "Şifre değiştiriliyor..."
                                : "Şifreyi Değiştir"}

                        </button>

                    </form>

                )}


                {/* ==================================
                    BACK TO LOGIN
                ================================== */}

                <button
                    type="button"
                    onClick={
                        onBackToLogin
                    }
                    style={{
                        display: "block",
                        width: "100%",
                        marginTop: "20px",
                        background:
                            "none",
                        border:
                            "none",
                        color:
                            "#8b8fff",
                        cursor:
                            "pointer"
                    }}
                >
                    ← Login'e Dön
                </button>

            </div>

        </div>
    );
}


export default ForgotPassword;