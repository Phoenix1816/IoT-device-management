import { useState } from "react";

import PersonelDashboard from "./PersonelDashboard";
import DevicePermissionManager from "../components/DevicePermissionManager";
import AuditLogDashboard from "./AuditLogDashboard";
import DeviceManagement from "../components/DeviceManagement";


function ManagerDashboard({
    user,
    onLogout
}) {

    // ==========================================
    // STATES
    // ==========================================

    const [showTelemetry, setShowTelemetry] =
        useState(false);

    const [showPermissions, setShowPermissions] =
        useState(false);

    const [showAuditLogs, setShowAuditLogs] =
        useState(false);

    const [showDeviceManagement, setShowDeviceManagement] =
        useState(false);


    // ==========================================
    // DEVICE MANAGEMENT
    // ==========================================

    if (showDeviceManagement) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#111318",
                    color: "#ffffff"
                }}
            >

                <DeviceManagement />


                {/* BACK BUTTON */}

                <button
                    onClick={() =>
                        setShowDeviceManagement(false)
                    }
                    style={{
                        position: "fixed",
                        top: "20px",
                        left: "20px",
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#646cff",
                        color: "#ffffff",
                        fontWeight: "bold",
                        cursor: "pointer",
                        zIndex: 1000
                    }}
                >
                    ← Manager Dashboard
                </button>

            </div>
        );
    }


    // ==========================================
    // AUDIT LOG DASHBOARD
    // ==========================================

    if (showAuditLogs) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#111318"
                }}
            >

                <AuditLogDashboard
                    onBack={() =>
                        setShowAuditLogs(false)
                    }
                />

            </div>
        );
    }


    // ==========================================
    // DEVICE PERMISSIONS
    // ==========================================

    if (showPermissions) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#111318"
                }}
            >

                <DevicePermissionManager />


                <button
                    onClick={() =>
                        setShowPermissions(false)
                    }
                    style={{
                        position: "fixed",
                        top: "20px",
                        left: "20px",
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#646cff",
                        color: "#ffffff",
                        fontWeight: "bold",
                        cursor: "pointer",
                        zIndex: 1000
                    }}
                >
                    ← Manager Dashboard
                </button>

            </div>
        );
    }


    // ==========================================
    // TELEMETRY DASHBOARD
    // ==========================================

    if (showTelemetry) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#111318"
                }}
            >

                <PersonelDashboard
                    user={user}
                    onLogout={onLogout}
                    onBackToManager={() =>
                        setShowTelemetry(false)
                    }
                />

            </div>
        );
    }


    // ==========================================
    // MANAGER DASHBOARD
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
                        Manager Dashboard
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
                DASHBOARD CARDS
            ====================================== */}

            <div
                style={{
                    marginTop: "30px",
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "20px"
                }}
            >


                {/* ==================================
                    TELEMETRY
                ================================== */}

                <div
                    style={{
                        backgroundColor: "#1b1e24",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "25px"
                    }}
                >

                    <h2>
                        📊 Telemetry
                    </h2>

                    <p
                        style={{
                            color: "#9ca3af",
                            lineHeight: "1.6"
                        }}
                    >
                        Cihazların canlı telemetry
                        verilerini, geçmiş verilerini
                        ve grafiklerini görüntüleyin.
                    </p>


                    <button
                        onClick={() =>
                            setShowTelemetry(true)
                        }
                        style={{
                            marginTop: "10px",
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor: "#646cff",
                            color: "#ffffff",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Telemetry Dashboard
                    </button>

                </div>


                {/* ==================================
                    DEVICE MANAGEMENT
                ================================== */}

                <div
                    style={{
                        backgroundColor: "#1b1e24",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "25px"
                    }}
                >

                    <h2>
                        🖥️ Device Management
                    </h2>

                    <p
                        style={{
                            color: "#9ca3af",
                            lineHeight: "1.6"
                        }}
                    >
                        Cihaz ekleme, düzenleme,
                        aktif/pasif durumlarını
                        ve cihaz yönetimini
                        gerçekleştirebilirsiniz.
                    </p>


                    <button
                        onClick={() =>
                            setShowDeviceManagement(true)
                        }
                        style={{
                            marginTop: "10px",
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor: "#287a43",
                            color: "#ffffff",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Cihaz Yönetimine Git
                    </button>

                </div>


                {/* ==================================
                    USER DEVICE PERMISSIONS
                ================================== */}

                <div
                    style={{
                        backgroundColor: "#1b1e24",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "25px"
                    }}
                >

                    <h2>
                        🔐 Device Permissions
                    </h2>

                    <p
                        style={{
                            color: "#9ca3af",
                            lineHeight: "1.6"
                        }}
                    >
                        Personellerin hangi cihazları
                        görüntüleyebileceğini
                        yönetin.
                    </p>


                    <button
                        onClick={() =>
                            setShowPermissions(true)
                        }
                        style={{
                            marginTop: "10px",
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor: "#8b5cf6",
                            color: "#ffffff",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Yetkileri Yönet
                    </button>

                </div>


            </div>

        </div>
    );
}


export default ManagerDashboard;