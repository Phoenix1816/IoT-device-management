import { useEffect, useState } from "react";

import apiRequest from "../services/api";


function DeviceManagement({
    user,
    onBack
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

    const [devices, setDevices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [newDeviceName, setNewDeviceName] =
        useState("");

    const [newDeviceThreshold, setNewDeviceThreshold] =
        useState(50);


    // ==========================================
    // GET DEVICES
    // ==========================================

    const fetchDevices = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await apiRequest("/Device");

            setDevices(data);

        } catch (err) {

            console.error(
                "Cihazlar alınamadı:",
                err
            );

            setError(
                err.message ||
                "Cihazlar alınırken bir hata oluştu."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        fetchDevices();

    }, []);


    // ==========================================
    // ADD DEVICE
    // ==========================================

    const addDevice = async (e) => {

        e.preventDefault();

        if (!newDeviceName.trim()) {

            alert(
                "Cihaz adı boş bırakılamaz."
            );

            return;
        }


        try {

            const createdDevice =
                await apiRequest(
                    "/Device",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            name:
                                newDeviceName.trim(),

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

        } catch (err) {

            console.error(
                "Cihaz ekleme hatası:",
                err
            );

            alert(
                err.message ||
                "Cihaz eklenemedi."
            );

        }
    };


    // ==========================================
    // UPDATE DEVICE
    // ==========================================

    const updateDevice = async (
        device
    ) => {

        const newName =
            window.prompt(
                "Yeni cihaz adı:",
                device.name
            );


        if (
            newName === null ||
            !newName.trim()
        ) {
            return;
        }


        const newThreshold =
            window.prompt(
                "Yeni threshold:",
                device.threshold
            );


        if (newThreshold === null) {
            return;
        }


        const threshold =
            Number(newThreshold);


        if (Number.isNaN(threshold)) {

            alert(
                "Threshold sayısal bir değer olmalıdır."
            );

            return;
        }


        try {

            const updatedDevice =
                await apiRequest(
                    `/Device/${device.id}`,
                    {
                        method: "PUT",

                        body: JSON.stringify({
                            id: device.id,

                            name:
                                newName.trim(),

                            threshold:
                                threshold,

                            isActive:
                                device.isActive
                        })
                    }
                );


            setDevices((current) =>
                current.map((item) =>
                    item.id === device.id
                        ? updatedDevice
                        : item
                )
            );

        } catch (err) {

            console.error(
                "Cihaz güncelleme hatası:",
                err
            );

            alert(
                err.message ||
                "Cihaz güncellenemedi."
            );
        }
    };


    // ==========================================
    // TOGGLE DEVICE
    // ==========================================

    const toggleDevice = async (
        device
    ) => {

        try {

            const updatedDevice =
                await apiRequest(
                    `/Device/${device.id}`,
                    {
                        method: "PUT",

                        body: JSON.stringify({
                            id: device.id,

                            name:
                                device.name,

                            threshold:
                                device.threshold,

                            isActive:
                                !device.isActive
                        })
                    }
                );


            setDevices((current) =>
                current.map((item) =>
                    item.id === device.id
                        ? updatedDevice
                        : item
                )
            );

        } catch (err) {

            console.error(
                "Cihaz durumu güncelleme hatası:",
                err
            );

            alert(
                err.message ||
                "Cihaz durumu güncellenemedi."
            );
        }
    };


    // ==========================================
    // DELETE DEVICE
    // ==========================================

    const deleteDevice = async (
        deviceId
    ) => {

        const confirmed =
            window.confirm(
                "Bu cihazı silmek istediğinize emin misiniz?"
            );


        if (!confirmed) {
            return;
        }


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

        } catch (err) {

            console.error(
                "Cihaz silme hatası:",
                err
            );

            alert(
                err.message ||
                "Cihaz silinemedi."
            );
        }
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

                    <h1
                        style={{
                            marginBottom: "8px"
                        }}
                    >
                        🖥️ Device Management
                    </h1>

                    <p
                        style={{
                            color: "#9ca3af",
                            margin: 0
                        }}
                    >
                        Cihazları ekleyin,
                        düzenleyin ve durumlarını yönetin.
                    </p>

                </div>


                /*<button
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
                </button>*/

            </div>


            <hr />


            {/* ======================================
                ADD DEVICE
            ====================================== */}

            {canManageDevices && (

                <div
                    style={{
                        backgroundColor: "#1b1e24",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "25px",
                        marginTop: "30px"
                    }}
                >

                    <h2>
                        ➕ Yeni Cihaz Ekle
                    </h2>


                    <form
                        onSubmit={addDevice}
                        style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap"
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Cihaz adı"
                            value={newDeviceName}
                            onChange={(e) =>
                                setNewDeviceName(
                                    e.target.value
                                )
                            }
                            style={{
                                flex: 1,
                                minWidth: "220px",
                                padding: "12px",
                                borderRadius: "6px",
                                border: "1px solid #444",
                                backgroundColor: "#252932",
                                color: "#ffffff"
                            }}
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
                            style={{
                                width: "150px",
                                padding: "12px",
                                borderRadius: "6px",
                                border: "1px solid #444",
                                backgroundColor: "#252932",
                                color: "#ffffff"
                            }}
                        />


                        <button
                            type="submit"
                            style={{
                                padding: "12px 20px",
                                border: "none",
                                borderRadius: "6px",
                                backgroundColor: "#287a43",
                                color: "#ffffff",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            Cihaz Ekle
                        </button>

                    </form>

                </div>

            )}


            {/* ======================================
                ERROR
            ====================================== */}

            {error && (

                <div
                    style={{
                        marginTop: "20px",
                        padding: "15px",
                        borderRadius: "8px",
                        backgroundColor: "#5b1f1f",
                        color: "#ffb4b4"
                    }}
                >
                    ❌ {error}
                </div>

            )}


            {/* ======================================
                DEVICE LIST
            ====================================== */}

            <div
                style={{
                    marginTop: "30px"
                }}
            >

                <h2>
                    Cihazlar
                </h2>


                {loading ? (

                    <p
                        style={{
                            color: "#9ca3af"
                        }}
                    >
                        Cihazlar yükleniyor...
                    </p>

                ) : devices.length === 0 ? (

                    <div
                        style={{
                            backgroundColor: "#1b1e24",
                            border: "1px solid #333",
                            borderRadius: "12px",
                            padding: "30px",
                            textAlign: "center",
                            color: "#9ca3af"
                        }}
                    >
                        Henüz kayıtlı cihaz bulunmuyor.
                    </div>

                ) : (

                    <div
                        style={{
                            display: "grid",
                            gap: "15px"
                        }}
                    >

                        {devices.map((device) => (

                            <div
                                key={device.id}
                                style={{
                                    backgroundColor: "#1b1e24",
                                    border: "1px solid #333",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "20px",
                                    flexWrap: "wrap"
                                }}
                            >

                                {/* DEVICE INFO */}

                                <div>

                                    <h3
                                        style={{
                                            margin:
                                                "0 0 8px 0"
                                        }}
                                    >
                                        🖥️ {device.name}
                                    </h3>

                                    <p
                                        style={{
                                            margin: "5px 0",
                                            color: "#9ca3af"
                                        }}
                                    >
                                        ID: {device.id}
                                    </p>

                                    <p
                                        style={{
                                            margin: "5px 0",
                                            color: "#9ca3af"
                                        }}
                                    >
                                        Threshold:{" "}
                                        {device.threshold}
                                    </p>

                                    <span
                                        style={{
                                            display:
                                                "inline-block",
                                            marginTop: "8px",
                                            padding:
                                                "6px 12px",
                                            borderRadius:
                                                "20px",
                                            backgroundColor:
                                                device.isActive
                                                    ? "#174d2c"
                                                    : "#4a2020",
                                            color:
                                                device.isActive
                                                    ? "#4ade80"
                                                    : "#f87171",
                                            fontWeight:
                                                "bold"
                                        }}
                                    >
                                        {device.isActive
                                            ? "● Aktif"
                                            : "● Pasif"}
                                    </span>

                                </div>


                                {/* ACTIONS */}

                                {canManageDevices && (

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            flexWrap: "wrap"
                                        }}
                                    >

                                        <button
                                            onClick={() =>
                                                toggleDevice(
                                                    device
                                                )
                                            }
                                            style={{
                                                padding:
                                                    "9px 14px",
                                                border: "none",
                                                borderRadius:
                                                    "6px",
                                                backgroundColor:
                                                    device.isActive
                                                        ? "#b7791f"
                                                        : "#287a43",
                                                color:
                                                    "#ffffff",
                                                fontWeight:
                                                    "bold",
                                                cursor:
                                                    "pointer"
                                            }}
                                        >
                                            {device.isActive
                                                ? "Pasifleştir"
                                                : "Aktifleştir"}
                                        </button>


                                        <button
                                            onClick={() =>
                                                updateDevice(
                                                    device
                                                )
                                            }
                                            style={{
                                                padding:
                                                    "9px 14px",
                                                border: "none",
                                                borderRadius:
                                                    "6px",
                                                backgroundColor:
                                                    "#646cff",
                                                color:
                                                    "#ffffff",
                                                fontWeight:
                                                    "bold",
                                                cursor:
                                                    "pointer"
                                            }}
                                        >
                                            Düzenle
                                        </button>


                                        {canDeleteDevices && (

                                            <button
                                                onClick={() =>
                                                    deleteDevice(
                                                        device.id
                                                    )
                                                }
                                                style={{
                                                    padding:
                                                        "9px 14px",
                                                    border: "none",
                                                    borderRadius:
                                                        "6px",
                                                    backgroundColor:
                                                        "#d9534f",
                                                    color:
                                                        "#ffffff",
                                                    fontWeight:
                                                        "bold",
                                                    cursor:
                                                        "pointer"
                                                }}
                                            >
                                                Sil
                                            </button>

                                        )}

                                    </div>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}


export default DeviceManagement;