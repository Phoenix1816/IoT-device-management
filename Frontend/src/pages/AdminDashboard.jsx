import { useEffect, useState } from "react";

import {
    getUsers,
    changeUserRole,
    banUser,
    unbanUser
} from "../services/userService";

import PersonelDashboard from "./PersonelDashboard";
import AuditLogDashboard from "./AuditLogDashboard";


function AdminDashboard({
    user,
    onLogout
}) {

    // ==========================================
    // STATES
    // ==========================================

    const [users, setUsers] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(false);

    const [showTelemetry, setShowTelemetry] =
        useState(false);

    const [showAuditLogs, setShowAuditLogs] =
        useState(false);


    // ==========================================
    // YETKİ KONTROLÜ
    // ==========================================

    const isAdmin =
        user?.role === "Admin";


    // ==========================================
    // KULLANICILARI GETİR
    // ==========================================

    const loadUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getUsers();

            setUsers(data);

        } catch (error) {

            console.error(
                "Kullanıcılar alınamadı:",
                error
            );

            setError(
                error.message ||
                "Kullanıcılar alınamadı."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // SAYFA AÇILINCA KULLANICILARI GETİR
    // ==========================================

    useEffect(() => {

        loadUsers();

    }, []);


    // ==========================================
    // ROL DEĞİŞTİR
    // ==========================================

    const handleRoleChange = async (
        userId,
        newRole
    ) => {

        try {

            setActionLoading(true);
            setError("");

            await changeUserRole(
                userId,
                newRole
            );

            await loadUsers();

        } catch (error) {

            console.error(
                "Rol değiştirme hatası:",
                error
            );

            setError(
                error.message ||
                "Rol değiştirilemedi."
            );

        } finally {

            setActionLoading(false);

        }
    };


    // ==========================================
    // BANLA
    // ==========================================

    const handleBan = async (
        userId
    ) => {

        // FRONTEND GÜVENLİK KONTROLÜ

        if (!isAdmin) {

            setError(
                "Bu işlem için Admin yetkisi gereklidir."
            );

            return;
        }


        // KENDİNİ BANLAMA KONTROLÜ

        if (userId === user?.id) {

            setError(
                "Kendi hesabınızı banlayamazsınız."
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Bu kullanıcıyı banlamak istediğinize emin misiniz?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(true);
            setError("");

            await banUser(userId);

            await loadUsers();

        } catch (error) {

            console.error(
                "Banlama hatası:",
                error
            );

            setError(
                error.message ||
                "Kullanıcı banlanamadı."
            );

        } finally {

            setActionLoading(false);

        }
    };


    // ==========================================
    // BAN KALDIR
    // ==========================================

    const handleUnban = async (
        userId
    ) => {

        // FRONTEND GÜVENLİK KONTROLÜ

        if (!isAdmin) {

            setError(
                "Bu işlem için Admin yetkisi gereklidir."
            );

            return;
        }


        try {

            setActionLoading(true);
            setError("");

            await unbanUser(userId);

            await loadUsers();

        } catch (error) {

            console.error(
                "Ban kaldırma hatası:",
                error
            );

            setError(
                error.message ||
                "Kullanıcının banı kaldırılamadı."
            );

        } finally {

            setActionLoading(false);

        }
    };


    // ==========================================
    // AUDIT LOG DASHBOARD
    // ==========================================

    if (showAuditLogs) {

        return (
            <AuditLogDashboard
                onBack={() =>
                    setShowAuditLogs(false)
                }
            />
        );
    }


    // ==========================================
    // TELEMETRY DASHBOARD
    // ==========================================

    if (showTelemetry) {

        return (

            <div
                style={{
                    position: "relative"
                }}
            >

                <PersonelDashboard
                    user={user}
                    onLogout={onLogout}
                    onBackToAdmin={() =>
                        setShowTelemetry(false)
                    }
                />

            </div>

        );
    }


    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    return (

        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#111318",
                color: "#ffffff",
                padding: "40px",
                boxSizing: "border-box"
            }}
        >

            {/* ======================================
                HEADER
            ====================================== */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px"
                }}
            >

                <div>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Hoş Geldin, {user?.name}
                    </p>

                    <p>
                        Rol: {user?.role}
                    </p>

                </div>


                <div
                    style={{
                        display: "flex",
                        alignItems: "center"
                    }}
                >

                    {/* ==================================
                        TELEMETRY
                    ================================== */}

                    <button
                        onClick={() =>
                            setShowTelemetry(true)
                        }
                        style={{
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor: "#646cff",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            marginRight: "10px"
                        }}
                    >
                        📊 Telemetry Dashboard
                    </button>


                    {/* ==================================
                        AUDIT LOGS
                    ================================== */}

                    <button
                        onClick={() =>
                            setShowAuditLogs(true)
                        }
                        style={{
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor: "#d28b00",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            marginRight: "10px"
                        }}
                    >
                        📋 Audit Logs
                    </button>


                    {/* ==================================
                        LOGOUT
                    ================================== */}

                    <button
                        onClick={onLogout}
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

            </div>


            <hr />


            {/* ======================================
                USER MANAGEMENT
            ====================================== */}

            <section
                style={{
                    marginTop: "30px"
                }}
            >

                <h2>
                    Kullanıcı Yönetimi
                </h2>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "12px",
                            borderRadius: "6px",
                            backgroundColor: "#3a1f1f",
                            color: "#ff6b6b"
                        }}
                    >
                        {error}
                    </div>

                )}


                {/* ==================================
                    LOADING
                ================================== */}

                {loading ? (

                    <p>
                        Kullanıcılar yükleniyor...
                    </p>

                ) : users.length === 0 ? (

                    <p>
                        Kayıtlı kullanıcı bulunamadı.
                    </p>

                ) : (

                    <div
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px"
                        }}
                    >

                        {users.map(
                            (currentUser) => (

                                <div
                                    key={
                                        currentUser.id
                                    }
                                    style={{
                                        padding: "20px",
                                        borderRadius: "10px",
                                        backgroundColor:
                                            "#1b1e24",
                                        border:
                                            "1px solid #333"
                                    }}
                                >

                                    {/* ==================================
                                        USER INFO
                                    ================================== */}

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "1fr 1fr 150px 150px",
                                            gap: "15px",
                                            alignItems:
                                                "center"
                                        }}
                                    >

                                        {/* NAME + EMAIL */}

                                        <div>

                                            <strong>
                                                {
                                                    currentUser.name
                                                }
                                            </strong>

                                            <div
                                                style={{
                                                    color:
                                                        "#9ca3af",
                                                    marginTop:
                                                        "5px"
                                                }}
                                            >
                                                {
                                                    currentUser.email
                                                }
                                            </div>

                                        </div>


                                        {/* ROLE */}

                                        <div>

                                            <select
                                                value={
                                                    currentUser.role
                                                }
                                                disabled={
                                                    actionLoading
                                                }
                                                onChange={
                                                    (e) =>
                                                        handleRoleChange(
                                                            currentUser.id,
                                                            e.target.value
                                                        )
                                                }
                                                style={{
                                                    width: "100%",
                                                    padding: "8px",
                                                    borderRadius: "6px",
                                                    border:
                                                        "1px solid #444",
                                                    backgroundColor:
                                                        "#252932",
                                                    color:
                                                        "#ffffff"
                                                }}
                                            >

                                                <option value="Personel">
                                                    Personel
                                                </option>

                                                <option value="Yönetici">
                                                    Yönetici
                                                </option>

                                                <option value="Admin">
                                                    Admin
                                                </option>

                                            </select>

                                        </div>


                                        {/* ACTIVE / BANNED */}

                                        <div>

                                            <span
                                                style={{
                                                    display:
                                                        "inline-block",
                                                    padding:
                                                        "6px 10px",
                                                    borderRadius:
                                                        "20px",
                                                    backgroundColor:
                                                        currentUser.isActive
                                                            ? "#1f3a29"
                                                            : "#3a1f1f",
                                                    color:
                                                        currentUser.isActive
                                                            ? "#6bff9c"
                                                            : "#ff6b6b"
                                                }}
                                            >
                                                {
                                                    currentUser.isActive
                                                        ? "● Aktif"
                                                        : "● Banlı"
                                                }
                                            </span>

                                        </div>


                                        {/* EMAIL STATUS */}

                                        <div>

                                            <span
                                                style={{
                                                    color:
                                                        currentUser.isEmailVerified
                                                            ? "#6bff9c"
                                                            : "#ffcc66"
                                                }}
                                            >
                                                {
                                                    currentUser.isEmailVerified
                                                        ? "✓ Doğrulandı"
                                                        : "⚠ Doğrulanmadı"
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    {/* ==================================
                                        ACTIONS
                                    ================================== */}

                                    {isAdmin && (

                                        <div
                                            style={{
                                                marginTop: "15px",
                                                display: "flex",
                                                gap: "10px"
                                            }}
                                        >

                                            {currentUser.isActive ? (

                                                <button
                                                    onClick={() =>
                                                        handleBan(
                                                            currentUser.id
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ||
                                                        currentUser.id ===
                                                            user?.id
                                                    }
                                                    style={{
                                                        padding:
                                                            "8px 15px",
                                                        border:
                                                            "none",
                                                        borderRadius:
                                                            "6px",
                                                        backgroundColor:
                                                            currentUser.id ===
                                                            user?.id
                                                                ? "#444"
                                                                : "#b52b2b",
                                                        color:
                                                            "#ffffff",
                                                        cursor:
                                                            currentUser.id ===
                                                            user?.id
                                                                ? "not-allowed"
                                                                : "pointer"
                                                    }}
                                                >
                                                    {currentUser.id === user?.id
                                                        ? "Kendiniz"
                                                        : "Banla"}
                                                </button>

                                            ) : (

                                                <button
                                                    onClick={() =>
                                                        handleUnban(
                                                            currentUser.id
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading
                                                    }
                                                    style={{
                                                        padding:
                                                            "8px 15px",
                                                        border:
                                                            "none",
                                                        borderRadius:
                                                            "6px",
                                                        backgroundColor:
                                                            "#287a43",
                                                        color:
                                                            "#ffffff",
                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >
                                                    Banı Kaldır
                                                </button>

                                            )}

                                        </div>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>
    );
}


export default AdminDashboard;