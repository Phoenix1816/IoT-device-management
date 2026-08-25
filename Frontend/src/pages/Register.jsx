import { useState } from "react";
import {
    register,
    verifyEmail
} from "../services/authService";


function Register({
    onRegisterSuccess,
    onBackToLogin
}) {

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [verificationCode, setVerificationCode] =
        useState("");


    const [step, setStep] =
        useState("register");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // REGISTER
    // ==========================================

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (
            password !==
            confirmPassword
        ) {

            setError(
                "Şifreler eşleşmiyor."
            );

            return;
        }


        if (password.length < 6) {

            setError(
                "Şifre en az 6 karakter olmalıdır."
            );

            return;
        }


        setLoading(true);


        try {

            await register(
                name,
                email,
                password
            );


            setSuccess(
                "Kayıt başarılı! Email adresinize gönderilen doğrulama kodunu girin."
            );


            setStep(
                "verify"
            );


        } catch (error) {

            console.error(
                "Register hatası:",
                error
            );


            setError(
                error.message ||
                "Kayıt başarısız."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // EMAIL VERIFICATION
    // ==========================================

    const handleVerifyEmail = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        setLoading(true);


        try {

            await verifyEmail(
                email,
                verificationCode
            );


            setSuccess(
                "Email başarıyla doğrulandı! Login ekranına yönlendiriliyorsunuz."
            );


            setTimeout(() => {

                if (onRegisterSuccess) {
                    onRegisterSuccess();
                }

            }, 1500);


        } catch (error) {

            console.error(
                "Email doğrulama hatası:",
                error
            );


            setError(
                error.message ||
                "Email doğrulaması başarısız."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // VERIFY SCREEN
    // ==========================================

    if (step === "verify") {

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
                            "0 10px 30px rgba(0,0,0,0.4)"
                    }}
                >

                    <h1
                        style={{
                            textAlign: "center",
                            marginBottom: "10px"
                        }}
                    >
                        Email Verification
                    </h1>


                    <p
                        style={{
                            textAlign: "center",
                            color: "#aaa",
                            marginBottom: "25px"
                        }}
                    >
                        {email}
                    </p>


                    <form
                        onSubmit={
                            handleVerifyEmail
                        }
                    >

                        <label>
                            Doğrulama Kodu
                        </label>


                        <input
                            type="text"
                            value={
                                verificationCode
                            }
                            onChange={(e) =>
                                setVerificationCode(
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
                                borderRadius: "6px",
                                border:
                                    "1px solid #444",
                                backgroundColor:
                                    "#252932",
                                color: "#ffffff",
                                fontSize: "18px",
                                textAlign: "center",
                                letterSpacing:
                                    "5px"
                            }}
                        />


                        {error && (

                            <div
                                style={{
                                    marginBottom: "20px",
                                    padding: "10px",
                                    borderRadius: "6px",
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
                                    marginBottom: "20px",
                                    padding: "10px",
                                    borderRadius: "6px",
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
                                padding: "12px",
                                border: "none",
                                borderRadius: "6px",
                                backgroundColor:
                                    loading
                                        ? "#444"
                                        : "#646cff",
                                color: "#ffffff",
                                fontSize: "16px",
                                fontWeight:
                                    "bold",
                                cursor:
                                    loading
                                        ? "not-allowed"
                                        : "pointer"
                            }}
                        >
                            {loading
                                ? "Doğrulanıyor..."
                                : "Email'i Doğrula"}
                        </button>

                    </form>


                    <button
                        type="button"
                        onClick={
                            onBackToLogin
                        }
                        style={{
                            width: "100%",
                            marginTop: "15px",
                            padding: "10px",
                            background:
                                "transparent",
                            border: "none",
                            color:
                                "#8b8fff",
                            cursor:
                                "pointer"
                        }}
                    >
                        Login ekranına dön
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // REGISTER SCREEN
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
                        "0 10px 30px rgba(0,0,0,0.4)"
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "25px"
                    }}
                >
                    Create Account
                </h1>


                <form
                    onSubmit={
                        handleRegister
                    }
                >

                    {/* NAME */}

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <label>
                            Ad Soyad
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            placeholder="Adınız"
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
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

                    </div>


                    {/* EMAIL */}

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

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

                    </div>


                    {/* PASSWORD */}

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <label>
                            Şifre
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Şifreniz"
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
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

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <label>
                            Şifre Tekrar
                        </label>

                        <input
                            type="password"
                            value={
                                confirmPassword
                            }
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Şifrenizi tekrar girin"
                            required
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
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

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div
                            style={{
                                marginBottom: "20px",
                                padding: "10px",
                                borderRadius: "6px",
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


                    {/* SUCCESS */}

                    {success && (

                        <div
                            style={{
                                marginBottom: "20px",
                                padding: "10px",
                                borderRadius: "6px",
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


                    {/* REGISTER */}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor:
                                loading
                                    ? "#444"
                                    : "#646cff",
                            color: "#ffffff",
                            fontSize: "16px",
                            fontWeight:
                                "bold",
                            cursor:
                                loading
                                    ? "not-allowed"
                                    : "pointer"
                        }}
                    >
                        {loading
                            ? "Kayıt oluşturuluyor..."
                            : "Kayıt Ol"}
                    </button>

                </form>


                {/* BACK TO LOGIN */}

                <button
                    type="button"
                    onClick={
                        onBackToLogin
                    }
                    style={{
                        width: "100%",
                        marginTop: "20px",
                        padding: "10px",
                        background:
                            "transparent",
                        border: "none",
                        color:
                            "#8b8fff",
                        cursor:
                            "pointer"
                    }}
                >
                    Zaten hesabım var →
                </button>

            </div>

        </div>
    );
}


export default Register;