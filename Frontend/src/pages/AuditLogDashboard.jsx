import { useEffect, useState } from "react";
import apiRequest from "../services/apiRequest";

function AuditLogDashboard({ onBack }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // AUDIT LOGLARI GETİR
    // ==========================================

    const loadLogs = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await apiRequest("/AuditLog");

            setLogs(data || []);
        }
        catch (err) {
            console.error(
                "Audit log yükleme hatası:",
                err
            );

            setError(
                err.message ||
                "Audit loglar yüklenemedi."
            );
        }
        finally {
            setLoading(false);
        }
    };


    // ==========================================
    // SAYFA AÇILDIĞINDA LOGLARI GETİR
    // ==========================================

    useEffect(() => {
        loadLogs();
    }, []);


    // ==========================================
    // TARİH FORMATLA
    // ==========================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString(
            "tr-TR"
        );
    };


    // ==========================================
    // ACTION RENK / ETİKET
    // ==========================================

    const getActionStyle = (action) => {

        if (
            action?.includes("DELETE") ||
            action?.includes("BANNED")
        ) {
            return {
                backgroundColor: "#7f1d1d",
                color: "#fecaca"
            };
        }

        if (
            action?.includes("CREATE") ||
            action?.includes("CREATED")
        ) {
            return {
                backgroundColor: "#14532d",
                color: "#bbf7d0"
            };
        }

        if (
            action?.includes("UPDATE") ||
            action?.includes("UPDATED") ||
            action?.includes("CHANGED")
        ) {
            return {
                backgroundColor: "#713f12",
                color: "#fef08a"
            };
        }

        if (
            action?.includes("UNBANNED")
        ) {
            return {
                backgroundColor: "#164e63",
                color: "#a5f3fc"
            };
        }

        return {
            backgroundColor: "#374151",
            color: "#e5e7eb"
        };
    };


    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#111318",
                color: "#ffffff",
                padding: "30px",
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

                    <h1
                        style={{
                            marginBottom: "8px"
                        }}
                    >
                        📋 Audit Logs
                    </h1>

                    <p
                        style={{
                            color: "#9ca3af",
                            margin: 0
                        }}
                    >
                        Sistemde gerçekleştirilen
                        yönetim işlemlerini görüntüleyin.
                    </p>

                </div>


                <div
                    style={{
                        display: "flex",
                        gap: "10px"
                    }}
                >

                    <button
                        onClick={loadLogs}
                        style={{
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor: "#287a43",
                            color: "#ffffff",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        🔄 Yenile
                    </button>


                    <button
                        onClick={onBack}
                        style={{
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor: "#646cff",
                            color: "#ffffff",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        ← Manager Dashboard
                    </button>

                </div>

            </div>


            {/* ======================================
                ERROR
            ====================================== */}

            {error && (

                <div
                    style={{
                        backgroundColor: "#450a0a",
                        border: "1px solid #7f1d1d",
                        color: "#fecaca",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "20px"
                    }}
                >
                    ❌ {error}
                </div>

            )}


            {/* ======================================
                LOADING
            ====================================== */}

            {loading ? (

                <div
                    style={{
                        textAlign: "center",
                        padding: "50px",
                        color: "#9ca3af"
                    }}
                >
                    Audit loglar yükleniyor...
                </div>

            ) : (

                <div
                    style={{
                        backgroundColor: "#1b1e24",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        overflow: "auto"
                    }}
                >

                    {/* ==================================
                        LOG SAYISI
                    ================================== */}

                    <div
                        style={{
                            padding: "18px 20px",
                            borderBottom:
                                "1px solid #333",
                            color: "#9ca3af"
                        }}
                    >
                        Toplam kayıt:{" "}
                        <strong
                            style={{
                                color: "#ffffff"
                            }}
                        >
                            {logs.length}
                        </strong>
                    </div>


                    {/* ==================================
                        TABLO
                    ================================== */}

                    {logs.length === 0 ? (

                        <div
                            style={{
                                padding: "50px",
                                textAlign: "center",
                                color: "#9ca3af"
                            }}
                        >
                            Henüz audit log bulunmuyor.
                        </div>

                    ) : (

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                minWidth: "1000px"
                            }}
                        >

                            <thead>

                                <tr
                                    style={{
                                        backgroundColor:
                                            "#252932"
                                    }}
                                >

                                    <th style={thStyle}>
                                        #
                                    </th>

                                    <th style={thStyle}>
                                        Action
                                    </th>

                                    <th style={thStyle}>
                                        User ID
                                    </th>

                                    <th style={thStyle}>
                                        Entity
                                    </th>

                                    <th style={thStyle}>
                                        Details
                                    </th>

                                    <th style={thStyle}>
                                        IP Address
                                    </th>

                                    <th style={thStyle}>
                                        Tarih
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {logs.map((log) => (

                                    <tr
                                        key={log.id}
                                        style={{
                                            borderTop:
                                                "1px solid #333"
                                        }}
                                    >

                                        <td style={tdStyle}>
                                            {log.id}
                                        </td>


                                        <td style={tdStyle}>

                                            <span
                                                style={{
                                                    ...getActionStyle(
                                                        log.action
                                                    ),
                                                    display:
                                                        "inline-block",
                                                    padding:
                                                        "6px 10px",
                                                    borderRadius:
                                                        "6px",
                                                    fontSize:
                                                        "12px",
                                                    fontWeight:
                                                        "bold",
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >
                                                {log.action}
                                            </span>

                                        </td>


                                        <td style={tdStyle}>
                                            {log.userId ?? "-"}
                                        </td>


                                        <td style={tdStyle}>

                                            {log.entityType
                                                ? `${log.entityType} #${log.entityId ?? "-"}`
                                                : "-"
                                            }

                                        </td>


                                        <td
                                            style={{
                                                ...tdStyle,
                                                maxWidth: "400px",
                                                whiteSpace:
                                                    "normal",
                                                lineHeight: "1.5"
                                            }}
                                        >
                                            {log.details || "-"}
                                        </td>


                                        <td style={tdStyle}>
                                            {log.ipAddress || "-"}
                                        </td>


                                        <td
                                            style={{
                                                ...tdStyle,
                                                whiteSpace:
                                                    "nowrap"
                                            }}
                                        >
                                            {formatDate(
                                                log.createdAt
                                            )}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            )}

        </div>
    );
}


// ==========================================
// TABLE STYLES
// ==========================================

const thStyle = {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: "13px",
    color: "#d1d5db",
    whiteSpace: "nowrap"
};

const tdStyle = {
    padding: "14px 16px",
    fontSize: "13px",
    color: "#e5e7eb",
    verticalAlign: "top"
};


export default AuditLogDashboard;