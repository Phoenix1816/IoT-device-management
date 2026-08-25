import { useEffect, useState } from "react";
import apiRequest from "../services/apiRequest";

function DevicePermissionManager() {

    const [users, setUsers] = useState([]);
    const [devices, setDevices] = useState([]);

    const [selectedUserId, setSelectedUserId] =
        useState("");

    const [selectedDeviceIds, setSelectedDeviceIds] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // ==========================================
    // PERSONELLERİ VE CİHAZLARI GETİR
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");
                setMessage("");

                // Personelleri getir
                const usersData =
                    await apiRequest("/User");

                // Cihazları getir
                const devicesData =
                    await apiRequest("/Device");


                // ======================================
                // SADECE PERSONEL KULLANICILARI AL
                // ======================================

                const personnel =
                    Array.isArray(usersData)
                        ? usersData.filter(user =>
                            (user.role ?? user.Role) === "Personel"
                        )
                        : [];


                setUsers(personnel);

                setDevices(
                    Array.isArray(devicesData)
                        ? devicesData
                        : []
                );

            }
            catch (err) {

                console.error(
                    "Permission data error:",
                    err
                );

                setError(
                    err.message ||
                    "Veriler alınırken hata oluştu."
                );

            }
            finally {

                setLoading(false);

            }

        };


        loadData();

    }, []);


    // ==========================================
    // PERSONEL DEĞİŞTİ
    // ==========================================

    const handleUserChange = async (event) => {

        const userId =
            event.target.value;


        setSelectedUserId(userId);

        setSelectedDeviceIds([]);

        setMessage("");

        setError("");


        if (!userId) {
            return;
        }


        try {

            setLoading(true);


            // ======================================
            // PERSONELİN MEVCUT YETKİLERİNİ GETİR
            // ======================================

            const permission =
                await apiRequest(
                    `/UserDevicePermission/${userId}`
                );


            const deviceIds =
                permission?.deviceIds ??
                permission?.DeviceIds ??
                [];


            // ID'leri number olarak normalize et
            setSelectedDeviceIds(
                Array.isArray(deviceIds)
                    ? deviceIds.map(Number)
                    : []
            );

        }
        catch (err) {

            console.error(
                "Permission fetch error:",
                err
            );

            setError(
                err.message ||
                "Personelin cihaz yetkileri alınamadı."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // CHECKBOX DEĞİŞİMİ
    // ==========================================

    const handleDeviceToggle = (deviceId) => {

        const numericDeviceId =
            Number(deviceId);


        setSelectedDeviceIds(previous => {

            if (
                previous.includes(
                    numericDeviceId
                )
            ) {

                return previous.filter(
                    id =>
                        id !== numericDeviceId
                );

            }


            return [
                ...previous,
                numericDeviceId
            ];

        });

    };


    // ==========================================
    // YETKİLERİ KAYDET
    // ==========================================

    const handleSave = async () => {

        if (!selectedUserId) {

            setError(
                "Önce bir personel seçmelisin."
            );

            return;
        }


        try {

            setLoading(true);

            setMessage("");

            setError("");


            // ======================================
            // PUT
            // ======================================

            await apiRequest(
                `/UserDevicePermission/${selectedUserId}`,
                {
                    method: "PUT",
                    body: JSON.stringify(
                        selectedDeviceIds
                    )
                }
            );


            setMessage(
                "Cihaz yetkileri başarıyla güncellendi."
            );

        }
        catch (err) {

            console.error(
                "Permission update error:",
                err
            );

            setError(
                err.message ||
                "Cihaz yetkileri güncellenemedi."
            );

        }
        finally {

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
                    marginBottom: "30px"
                }}
            >

                <h1>
                    🔐 Device Permissions
                </h1>

                <p
                    style={{
                        color: "#9ca3af"
                    }}
                >
                    Personellerin hangi cihazları
                    görüntüleyebileceğini yönetin.
                </p>

            </div>


            {/* ======================================
                PERSONEL SEÇİMİ
            ====================================== */}

            <div
                style={{
                    backgroundColor: "#1b1e24",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "25px",
                    marginBottom: "25px"
                }}
            >

                <h2>
                    Personel Seç
                </h2>


                <select
                    value={selectedUserId}
                    onChange={handleUserChange}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "10px",
                        backgroundColor: "#252832",
                        color: "#ffffff",
                        border: "1px solid #444",
                        borderRadius: "6px",
                        fontSize: "16px",
                        cursor: loading
                            ? "not-allowed"
                            : "pointer"
                    }}
                >

                    <option value="">
                        -- Personel Seç --
                    </option>


                    {users.map(user => {

                        const userId =
                            user.id ??
                            user.Id;

                        const userName =
                            user.name ??
                            user.Name ??
                            `User ${userId}`;


                        return (

                            <option
                                key={userId}
                                value={userId}
                            >
                                {userName}
                            </option>

                        );

                    })}

                </select>

            </div>


            {/* ======================================
                CİHAZLAR
            ====================================== */}

            {selectedUserId && (

                <div
                    style={{
                        backgroundColor: "#1b1e24",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "25px"
                    }}
                >

                    <h2>
                        Cihaz Yetkileri
                    </h2>


                    <p
                        style={{
                            color: "#9ca3af"
                        }}
                    >
                        Personelin görebileceği
                        cihazları seçin.
                    </p>


                    {/* ==================================
                        DEVICE LIST
                    ================================== */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "12px",
                            marginTop: "20px"
                        }}
                    >

                        {devices.length === 0 && (

                            <p
                                style={{
                                    color: "#9ca3af"
                                }}
                            >
                                Sistemde kayıtlı cihaz bulunamadı.
                            </p>

                        )}


                        {devices.map(device => {

                            const deviceId =
                                Number(
                                    device.id ??
                                    device.Id
                                );

                            const deviceName =
                                device.name ??
                                device.Name ??
                                `Device ${deviceId}`;


                            const checked =
                                selectedDeviceIds.includes(
                                    deviceId
                                );


                            return (

                                <label
                                    key={deviceId}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "15px",
                                        backgroundColor:
                                            checked
                                                ? "#293d30"
                                                : "#252832",
                                        border:
                                            checked
                                                ? "1px solid #45d483"
                                                : "1px solid #444",
                                        borderRadius: "8px",
                                        cursor: "pointer"
                                    }}
                                >

                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        disabled={loading}
                                        onChange={() =>
                                            handleDeviceToggle(
                                                deviceId
                                            )
                                        }
                                        style={{
                                            width: "18px",
                                            height: "18px"
                                        }}
                                    />


                                    <div>

                                        <strong>
                                            {deviceName}
                                        </strong>

                                        <div
                                            style={{
                                                color: "#9ca3af",
                                                fontSize: "13px"
                                            }}
                                        >
                                            ID: {deviceId}
                                        </div>

                                    </div>

                                </label>

                            );

                        })}

                    </div>


                    {/* ==================================
                        SAVE BUTTON
                    ================================== */}

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        style={{
                            marginTop: "25px",
                            padding: "12px 24px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor:
                                loading
                                    ? "#555"
                                    : "#646cff",
                            color: "#ffffff",
                            fontWeight: "bold",
                            cursor:
                                loading
                                    ? "not-allowed"
                                    : "pointer"
                        }}
                    >

                        {loading
                            ? "Kaydediliyor..."
                            : "Yetkileri Kaydet"}

                    </button>


                    {/* ==================================
                        SUCCESS MESSAGE
                    ================================== */}

                    {message && (

                        <p
                            style={{
                                marginTop: "15px",
                                color: "#45d483"
                            }}
                        >
                            ✅ {message}
                        </p>

                    )}


                    {/* ==================================
                        ERROR MESSAGE
                    ================================== */}

                    {error && (

                        <p
                            style={{
                                marginTop: "15px",
                                color: "#ff6b6b"
                            }}
                        >
                            ❌ {error}
                        </p>

                    )}

                </div>

            )}


            {/* ======================================
                INITIAL LOADING
            ====================================== */}

            {loading && !selectedUserId && (

                <p
                    style={{
                        color: "#9ca3af"
                    }}
                >
                    Veriler yükleniyor...
                </p>

            )}

        </div>

    );
}

export default DevicePermissionManager;