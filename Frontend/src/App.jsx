import { useState } from "react";

import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import PersonelDashboard from "./pages/PersonelDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import {
    getUser,
    logout
} from "./services/authService";

import "./App.css";


function App() {

    // ==========================================
    // AUTHENTICATION
    // ==========================================

    const [isAuthenticated, setIsAuthenticated] =
        useState(
            !!sessionStorage.getItem("token")
        );


    const [user, setUser] =
        useState(() => getUser());


    // ==========================================
    // SCREENS
    // ==========================================

    const [showRegister, setShowRegister] =
        useState(false);

    const [showForgotPassword, setShowForgotPassword] =
        useState(false);


    // ==========================================
    // LOGIN
    // ==========================================

    const handleLogin = (data) => {

        console.log("========== LOGIN ==========");
        console.log("Login Data:", data);
        console.log("Login User:", data?.user);
        console.log("Login Role:", data?.user?.role);
        console.log("===========================");

        setUser(data.user);

        setIsAuthenticated(true);

        setShowRegister(false);

        setShowForgotPassword(false);
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        logout();

        setUser(null);

        setIsAuthenticated(false);

        setShowRegister(false);

        setShowForgotPassword(false);
    };


    // ==========================================
    // LOGIN / REGISTER / PASSWORD RESET
    // ==========================================

    if (!isAuthenticated) {

        // ======================================
        // REGISTER
        // ======================================

        if (showRegister) {

            return (
                <Register

                    onRegisterSuccess={() => {
                        setShowRegister(false);
                    }}

                    onBackToLogin={() => {
                        setShowRegister(false);
                    }}

                />
            );
        }


        // ======================================
        // FORGOT PASSWORD
        // ======================================

        if (showForgotPassword) {

            return (
                <ForgotPassword

                    onBackToLogin={() => {
                        setShowForgotPassword(false);
                    }}

                />
            );
        }


        // ======================================
        // LOGIN
        // ======================================

        return (
            <Login

                onLogin={handleLogin}

                onRegister={() => {
                    setShowRegister(true);
                }}

                onForgotPassword={() => {
                    setShowForgotPassword(true);
                }}

            />
        );
    }


    // ==========================================
    // ROLE
    // ==========================================

    /*
        Backend'den gelen role değerini
        güvenli şekilde normalize ediyoruz.

        Örnek:

        "Yönetici"
        " Yönetici "
        "yönetici"

        hepsi aynı role dönüştürülür.
    */

    const normalizedRole =
        user?.role
            ?.trim()
            .toLocaleLowerCase("tr-TR");


    console.log("========== DASHBOARD ROUTING ==========");
    console.log("User:", user);
    console.log("Original Role:", user?.role);
    console.log("Normalized Role:", normalizedRole);
    console.log("=======================================");


    // ==========================================
    // ADMIN
    // ==========================================

    if (normalizedRole === "admin") {

        return (
            <AdminDashboard
                user={user}
                onLogout={handleLogout}
            />
        );
    }


    // ==========================================
    // MANAGER / YÖNETİCİ
    // ==========================================

    if (normalizedRole === "yönetici") {

        return (
            <ManagerDashboard
                user={user}
                onLogout={handleLogout}
            />
        );
    }


    // ==========================================
    // PERSONEL
    // ==========================================

    if (normalizedRole === "personel") {

        return (
            <PersonelDashboard
                user={user}
                onLogout={handleLogout}
            />
        );
    }


    // ==========================================
    // UNKNOWN ROLE
    // ==========================================

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#111318",
                color: "#ffffff",
                flexDirection: "column",
                gap: "20px",
                padding: "40px",
                boxSizing: "border-box"
            }}
        >

            <h1>
                Yetkisiz Kullanıcı
            </h1>


            <p>
                Tanımlanamayan kullanıcı rolü:
                {" "}
                {user?.role || "Bilinmiyor"}
            </p>


            <p
                style={{
                    color: "#9ca3af"
                }}
            >
                Normalleştirilmiş rol:
                {" "}
                {normalizedRole || "Bilinmiyor"}
            </p>


            <button
                onClick={handleLogout}
                style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#d9534f",
                    color: "#ffffff",
                    fontWeight: "bold",
                    cursor: "pointer"
                }}
            >
                Çıkış Yap
            </button>

        </div>
    );
}


export default App;