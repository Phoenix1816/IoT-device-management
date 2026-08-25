import { useEffect, useState } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import connection from "../services/signalRService";

import {
    loadDeviceHistories,
    appendTelemetryHistory,
    getTelemetryHistory
} from "../services/telemetryService";

import apiRequest from "../services/api";


function PersonelDashboard({
    user,
    onLogout,
    onBackToAdmin,
    onBackToManager
}) {

    // ==========================================
    // ROLE PERMISSIONS
    // ==========================================

    const canManageDevices =
        user?.role === "Yönetici" ||
        user?.role === "Admin";

    const canDeleteDevices =
        user?.role === "Admin";


    // ==========================================
    // STATES
    // ==========================================

    const [telemetry, setTelemetry] =
        useState({});

    const [history, setHistory] =
        useState({});

    const [devices, setDevices] =
        useState([]);

    // Frontend'in SignalR üzerinden
    // son telemetry aldığı zaman
    const [lastTelemetryReceived, setLastTelemetryReceived] =
        useState({});

    const [newDeviceName, setNewDeviceName] =
        useState("");

    const [newDeviceThreshold, setNewDeviceThreshold] =
        useState(50);


    // ==========================================
    // CİHAZLARI GETİR
    // ==========================================

    const fetchDevices = async () => {

        try {

            const data =
                await apiRequest("/Device");

            setDevices(data);

            const historyData =
                await loadDeviceHistories(
                    data,
                    50
                );

            setHistory(historyData);

        } catch (error) {

            console.error(
                "Device API hatası:",
                error
            );

        }
    };


    // ==========================================
    // YENİ CİHAZ EKLE
    // YÖNETİCİ + ADMIN
    // ==========================================

    const addDevice = async (e) => {

        e.preventDefault();

        if (!newDeviceName.trim()) {
            return;
        }

        try {

            const createdDevice =
                await apiRequest(
                    "/Device",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            name: newDeviceName,

                            threshold:
                                Number(
                                    newDeviceThreshold
                                ),

                            isActive: true
                        })
                    }
                );

            setDevices((current) => [
                ...current,
                createdDevice
            ]);

            setNewDeviceName("");

            setNewDeviceThreshold(50);

            console.log(
                "Cihaz eklendi:",
                createdDevice
            );

        } catch (error) {

            console.error(
                "Cihaz ekleme hatası:",
                error
            );

        }
    };


    // ==========================================
    // CİHAZ SİL
    // SADECE ADMIN
    // ==========================================

    const deleteDevice = async (deviceId) => {

        try {

            await apiRequest(
                `/Device/${deviceId}`,
                {
                    method: "DELETE"
                }
            );

            setDevices((current) =>
                current.filter(
                    (device) =>
                        device.id !== deviceId
                )
            );

            setTelemetry((current) => {

                const updated = {
                    ...current
                };

                delete updated[deviceId];

                return updated;

            });

            setHistory((current) => {

                const updated = {
                    ...current
                };

                delete updated[deviceId];

                return updated;

            });

            setLastTelemetryReceived((current) => {

                const updated = {
                    ...current
                };

                delete updated[deviceId];

                return updated;

            });

            console.log(
                `Device ${deviceId} silindi.`
            );

        } catch (error) {

            console.error(
                "Cihaz silme hatası:",
                error
            );

        }
    };


    // ==========================================
    // CİHAZ GÜNCELLE
    // YÖNETİCİ + ADMIN
    // ==========================================

    const updateDevice = async (
        deviceId,
        name,
        threshold
    ) => {

        try {

            const device =
                devices.find(
                    (device) =>
                        device.id === deviceId
                );

            if (!device) {
                return;
            }

            const updatedDevice =
                await apiRequest(
                    `/Device/${deviceId}`,
                    {
                        method: "PUT",

                        body: JSON.stringify({
                            id: deviceId,

                            name: name,

                            threshold:
                                Number(
                                    threshold
                                ),

                            isActive:
                                device.isActive
                        })
                    }
                );

            setDevices((current) =>
                current.map((device) =>
                    device.id === deviceId
                        ? updatedDevice
                        : device
                )
            );

            console.log(
                "Cihaz güncellendi:",
                updatedDevice
            );

        } catch (error) {

            console.error(
                "Cihaz güncelleme hatası:",
                error
            );

        }
    };


    // ==========================================
    // CİHAZ AKTİF / PASİF
    // YÖNETİCİ + ADMIN
    // ==========================================

    const toggleDevice = async (deviceId) => {

        try {

            const device =
                devices.find(
                    (device) =>
                        device.id === deviceId
                );

            if (!device) {
                return;
            }

            const updatedDevice =
                await apiRequest(
                    `/Device/${deviceId}`,
                    {
                        method: "PUT",

                        body: JSON.stringify({
                            id: device.id,

                            name: device.name,

                            threshold:
                                device.threshold,

                            isActive:
                                !device.isActive
                        })
                    }
                );

            setDevices((current) =>
                current.map((device) =>
                    device.id === deviceId
                        ? updatedDevice
                        : device
                )
            );


            // ========================================
            // PASİF HALE GELDİ
            // ========================================

            if (!updatedDevice.isActive) {

                setTelemetry((current) => {

                    const updated = {
                        ...current
                    };

                    delete updated[deviceId];

                    return updated;

                });

                setHistory((current) => {

                    const updated = {
                        ...current
                    };

                    delete updated[deviceId];

                    return updated;

                });

                // Eski Online bilgisini temizle
                setLastTelemetryReceived((current) => {

                    const updated = {
                        ...current
                    };

                    delete updated[deviceId];

                    return updated;

                });

            }


            // ========================================
            // AKTİF HALE GELDİ
            // ========================================

            else {

                try {

                    const deviceHistory =
                        await getTelemetryHistory(
                            deviceId,
                            50
                        );

                    setHistory((current) => ({
                        ...current,

                        [deviceId]:
                            deviceHistory
                    }));

                } catch (error) {

                    console.error(
                        "Cihaz history yükleme hatası:",
                        error
                    );

                }

            }

            console.log(
                "Cihaz durumu güncellendi:",
                updatedDevice
            );

        } catch (error) {

            console.error(
                "Cihaz durumu güncelleme hatası:",
                error
            );

        }
    };


    // ==========================================
    // SIGNALR + DEVICE INITIALIZATION
    // ==========================================

    useEffect(() => {

        const startConnection = async () => {

            try {

                if (
                    connection.state ===
                    "Disconnected"
                ) {

                    await connection.start();

                    console.log(
                        "SignalR bağlantısı başarılı."
                    );

                }

            } catch (error) {

                console.error(
                    "SignalR bağlantı hatası:",
                    error
                );

            }
        };


        const initialize = async () => {

            await fetchDevices();

            await startConnection();

        };


        // ========================================
        // SIGNALR TELEMETRY
        // ========================================

        connection.on(
            "ReceiveTelemetry",
            (data) => {

                console.log(
                    "Yeni telemetri:",
                    data
                );


                // ==================================
                // TELEMETRY STATE
                // ==================================

                setTelemetry((current) => ({
                    ...current,

                    [data.deviceId]: data
                }));


                // ==================================
                // HISTORY
                // ==================================

                setHistory((current) =>
                    appendTelemetryHistory(
                        current,
                        data,
                        50
                    )
                );


                // ==================================
                // LAST SEEN
                // ==================================
                //
                // Backend'in gönderdiği gerçek
                // telemetry timestamp'i.
                //
                // Bu değer cihazın gerçekten
                // en son ne zaman veri gönderdiğini
                // gösterir.
                //

                setDevices((current) =>
                    current.map((device) =>
                        device.id === data.deviceId
                            ? {
                                ...device,

                                lastSeen:
                                    data.lastSeen
                            }
                            : device
                    )
                );


                // ==================================
                // SON SIGNALR TELEMETRY ZAMANI
                // ==================================
                //
                // Online / Offline hesabında
                // bunu kullanıyoruz.
                //
                // Böylece cihaz Activate edildiğinde
                // eski LastSeen üzerinden direkt
                // Online görünmüyor.
                //

                setLastTelemetryReceived(
                    (current) => ({
                        ...current,

                        [data.deviceId]:
                            Date.now()
                    })
                );

            }
        );


        initialize();


        // ========================================
        // ONLINE / OFFLINE CHECK
        // ========================================

        const onlineCheckInterval =
            setInterval(() => {

                // Sadece component'in yeniden
                // render edilmesini sağlıyoruz.
                //
                // Böylece 30 saniye dolduğunda
                // Online → Offline dönüşebiliyor.

                setDevices((current) =>
                    [...current]
                );

            }, 5000);


        // ========================================
        // CLEANUP
        // ========================================

        return () => {

            connection.off(
                "ReceiveTelemetry"
            );

            clearInterval(
                onlineCheckInterval
            );

        };

    }, []);


    // ==========================================
    // DASHBOARD
    // ==========================================

    return (

        <div
            className="dashboard"
            style={{
                minHeight: "100vh",
                boxSizing: "border-box",
                padding: "30px"
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
                    marginBottom: "20px"
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0
                        }}
                    >
                        IoT Telemetry Dashboard
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            marginBottom: "4px"
                        }}
                    >
                        Hoş geldin, {user?.name}
                    </p>

                    <p
                        style={{
                            marginTop: 0
                        }}
                    >
                        Rol: {user?.role}
                    </p>

                </div>


                <button
                    onClick={onLogout}
                    style={{
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#d9534f",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Çıkış Yap
                </button>

            </div>


            {/* ======================================
                YÖNETİM PANELİNE GERİ DÖN
            ====================================== */}

            {(
                (user?.role === "Admin" &&
                    onBackToAdmin) ||

                (user?.role === "Yönetici" &&
                    onBackToManager)
            ) && (

                <div
                    style={{
                        borderTop:
                            "1px solid #555",

                        paddingTop:
                            "15px",

                        marginBottom:
                            "25px",

                        display: "flex",

                        justifyContent:
                            "flex-start"
                    }}
                >

                    <button
                        onClick={
                            user?.role === "Admin"
                                ? onBackToAdmin
                                : onBackToManager
                        }
                        style={{
                            padding:
                                "9px 18px",

                            border: "none",

                            borderRadius:
                                "6px",

                            backgroundColor:
                                "#6366f1",

                            color:
                                "#ffffff",

                            fontSize:
                                "14px",

                            fontWeight:
                                "bold",

                            cursor:
                                "pointer"
                        }}
                    >
                        ← Yönetim Paneline Dön
                    </button>

                </div>

            )}


            {/* ======================================
                CİHAZ EKLEME
                YÖNETİCİ + ADMIN
            ====================================== */}

            {canManageDevices && (

                <form
                    className="device-form"
                    onSubmit={addDevice}
                >

                    <input
                        type="text"
                        placeholder="Device name"
                        value={newDeviceName}
                        onChange={(e) =>
                            setNewDeviceName(
                                e.target.value
                            )
                        }
                    />

                    <input
                        type="number"
                        placeholder="Threshold"
                        value={newDeviceThreshold}
                        onChange={(e) =>
                            setNewDeviceThreshold(
                                e.target.value
                            )
                        }
                    />

                    <button type="submit">
                        + Add Device
                    </button>

                </form>

            )}


            {/* ======================================
                DEVICE GRID
            ====================================== */}

            <div className="device-grid">

                {devices.map((device) => {

                    const data =
                        telemetry[device.id];

                    const deviceThreshold =
                        data?.threshold ??
                        device.threshold;

                    const isWarning =
                        data &&
                        data.value >
                        deviceThreshold;


                    // ==================================
                    // ONLINE / OFFLINE
                    // ==================================
                    //
                    // Online hesabında LastSeen
                    // KULLANMIYORUZ.
                    //
                    // Çünkü LastSeen geçmişteki
                    // gerçek telemetry zamanıdır.
                    //
                    // Burada SignalR'dan son telemetry
                    // alma zamanını kullanıyoruz.
                    //

                    const lastTelemetryTime =
                        lastTelemetryReceived[
                            device.id
                        ];

                    const secondsSinceTelemetry =
                        lastTelemetryTime
                            ? (
                                Date.now() -
                                lastTelemetryTime
                            ) / 1000
                            : null;

                    const isOnline =
                        secondsSinceTelemetry !== null &&
                        secondsSinceTelemetry < 30;


                    return (

                        <div
                            className={
                                `device-card ${
                                    isWarning
                                        ? "warning"
                                        : "normal"
                                } ${
                                    !device.isActive
                                        ? "inactive-card"
                                        : ""
                                }`
                            }
                            key={device.id}
                        >

                            <h2>
                                {device.name}
                            </h2>


                            {/* =================================
                                AKTİF CİHAZ
                            ================================= */}

                            {device.isActive &&
                            data ? (

                                <>

                                    <div className="value">
                                        {data.value.toFixed(2)}
                                    </div>

                                    <p>
                                        Current Value
                                    </p>

                                    <p>
                                        Threshold:{" "}
                                        {deviceThreshold}
                                    </p>

                                    <p>
                                        Status:{" "}
                                        {
                                            isWarning
                                                ? "⚠️ Warning"
                                                : "✅ Normal"
                                        }
                                    </p>


                                    {/* =================================
                                        CONNECTION STATUS
                                    ================================= */}

                                    <div
                                        style={{
                                            marginTop:
                                                "10px",

                                            marginBottom:
                                                "8px"
                                        }}
                                    >

                                        {lastTelemetryTime == null ? (

                                            <span>
                                                ⚪ Never Connected
                                            </span>

                                        ) : isOnline ? (

                                            <span>
                                                🟢 Online
                                            </span>

                                        ) : (

                                            <span>
                                                🔴 Offline
                                            </span>

                                        )}

                                    </div>


                                    <span className="status status-active">
                                        ● Active
                                    </span>


                                    {/* =================================
                                        LAST SEEN
                                    ================================= */}

                                    <small
                                        style={{
                                            display:
                                                "block",

                                            marginTop:
                                                "6px"
                                        }}
                                    >

                                        Last Seen:{" "}

                                        {device.lastSeen
                                            ? new Date(
                                                device.lastSeen
                                            ).toLocaleTimeString()
                                            : "Never"}

                                    </small>


                                    {/* =================================
                                        TELEMETRY CHART
                                    ================================= */}

                                    <div className="chart">

                                        <ResponsiveContainer
                                            width="100%"
                                            height={220}
                                        >

                                            <LineChart
                                                data={
                                                    history[
                                                        device.id
                                                    ] || []
                                                }
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                />

                                                <XAxis
                                                    dataKey="time"
                                                />

                                                <YAxis
                                                    domain={[
                                                        0,
                                                        100
                                                    ]}
                                                />

                                                <Tooltip />

                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#646cff"
                                                    strokeWidth={2}
                                                    dot={false}
                                                />

                                            </LineChart>

                                        </ResponsiveContainer>

                                    </div>

                                </>

                            ) : (

                                /* =================================
                                   PASİF CİHAZ
                                ================================= */

                                <div className="inactive-message">

                                    <div className="inactive-icon">
                                        ⏸
                                    </div>

                                    <p>
                                        Device is inactive
                                    </p>

                                    <span className="status status-inactive">
                                        ● Inactive
                                    </span>

                                </div>

                            )}


                            {/* =================================
                                AKTİF / PASİF
                                YÖNETİCİ + ADMIN
                            ================================= */}

                            {canManageDevices && (

                                <button
                                    className="toggle-button"
                                    onClick={() =>
                                        toggleDevice(
                                            device.id
                                        )
                                    }
                                >

                                    {
                                        device.isActive
                                            ? "Deactivate Device"
                                            : "Activate Device"
                                    }

                                </button>

                            )}


                            {/* =================================
                                EDIT
                                YÖNETİCİ + ADMIN
                            ================================= */}

                            {canManageDevices && (

                                <button
                                    className="edit-button"
                                    onClick={() => {

                                        const newName =
                                            prompt(
                                                "Yeni cihaz adı:",
                                                device.name
                                            );

                                        const newThreshold =
                                            prompt(
                                                "Yeni threshold:",
                                                device.threshold
                                            );

                                        if (
                                            newName &&
                                            newThreshold !== null
                                        ) {

                                            updateDevice(
                                                device.id,
                                                newName,
                                                newThreshold
                                            );

                                        }

                                    }}
                                >
                                    Edit Device
                                </button>

                            )}


                            {/* =================================
                                DELETE
                                SADECE ADMIN
                            ================================= */}

                            {canDeleteDevices && (

                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        deleteDevice(
                                            device.id
                                        )
                                    }
                                >
                                    Delete Device
                                </button>

                            )}

                        </div>

                    );

                })}

            </div>

        </div>
    );
}


export default PersonelDashboard;