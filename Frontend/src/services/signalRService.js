import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7071/hubs/telemetry")
    .withAutomaticReconnect()
    .build();

export default connection;