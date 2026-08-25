import { useState } from "react";

import { login } from "../services/authService";


function Login({
    onLogin,
    onRegister,
    onForgotPassword
}) {

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // LOGIN
    // ==========================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");

        setLoading(true);


        try {

            const data =
                await login(
                    email,
                    password
                );


            console.log(
                "Login başarılı:",
                data
            );


            console.log(
                "JWT Token:",
                data.token
            );


            setSuccess(
                `Hoş geldin ${data.user.name}!`
            );


            if (onLogin) {

                onLogin(data);

            }

        } catch (error) {

            console.error(
                "Login hatası:",
                error
            );


            setError(
                error.message ||
                "Giriş başarısız."
            );

        } finally {

            setLoading(false);

        }
    };


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
                    IoT Telemetry
                </h1>


                <h1
                    style={{
                        textAlign: "center",
                        marginTop: "0",
                        marginBottom: "25px"
                    }}
                >
                    Dashboard
                </h1>


                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "25px"
                    }}
                >
                    Login
                </h2>


                <form onSubmit={handleLogin}>

                    {/* EMAIL */}

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px"
                            }}
                        >
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

                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px"
                            }}
                        >
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


                    {/* LOGIN BUTTON */}

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
                            ? "Giriş yapılıyor..."
                            : "Giriş Yap"}

                    </button>

                </form>


                {/* ======================================
                    FORGOT PASSWORD
                ====================================== */}

                <button
                    type="button"
                    onClick={onForgotPassword}
                    style={{
                        display: "block",
                        width: "100%",
                        marginTop: "20px",
                        background: "none",
                        border: "none",
                        color: "#8b8fff",
                        cursor: "pointer"
                    }}
                >
                    Şifremi Unuttum
                </button>


                {/* ======================================
                    REGISTER
                ====================================== */}

                <button
                    type="button"
                    onClick={onRegister}
                    style={{
                        display: "block",
                        width: "100%",
                        marginTop: "10px",
                        background: "none",
                        border: "none",
                        color: "#8b8fff",
                        cursor: "pointer"
                    }}
                >
                    Hesap Oluştur
                </button>

            </div>

        </div>
    );
}


export default Login;