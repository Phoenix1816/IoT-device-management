const API_URL = 'https://localhost:7071/api/Telemetry'

export const getTelemetryHistory = async (
  deviceId,
  points = 50
) => {
  const response = await fetch(
    `${API_URL}/${deviceId}/history?points=${points}`
  )

  if (!response.ok) {
    throw new Error('Telemetry geçmişi alınamadı.')
  }

  const history = await response.json()

  return history.map((item) => ({
    time: new Date(
      item.timestamp
    ).toLocaleTimeString(),
    value: item.value
  }))
}

export const appendTelemetryHistory = (
  currentHistory,
  telemetryData,
  maxPoints = 50
) => {
  const deviceHistory =
    currentHistory[telemetryData.deviceId] || []

  const updatedHistory = [
    ...deviceHistory,
    {
      time: new Date(
        telemetryData.timestamp
      ).toLocaleTimeString(),
      value: telemetryData.value
    }
  ]

  return {
    ...currentHistory,
    [telemetryData.deviceId]:
      updatedHistory.slice(-maxPoints)
  }
}

export const loadDeviceHistories = async (
  devices,
  points = 50
) => {
  const historyData = {}

  for (const device of devices) {
    try {
      historyData[device.id] =
        await getTelemetryHistory(
          device.id,
          points
        )
    } catch (error) {
      console.error(
        `Device ${device.id} history alınamadı:`,
        error
      )

      historyData[device.id] = []
    }
  }

  return historyData
}