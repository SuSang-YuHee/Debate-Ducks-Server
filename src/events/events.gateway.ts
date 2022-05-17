import { channel } from "diagnostics_channel";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { onlineMap } from "./onlineMap";

@WebSocketGateway({ namespace: /\/ws-.+/, cors: { origin: "*" } })

// 필수 구현요소 검사용으로 implements
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // express socket.io의 io 역할
  @WebSocketServer() public server: Server;

  @SubscribeMessage("test")
  handleTest(@MessageBody() data: string) {
    console.log("test", data);
  }

  @SubscribeMessage("login")
  handleLogin(
    @MessageBody() data: { id: number; channels: number[] },
    @ConnectedSocket() socket: Socket,
  ) {
    const newNamespace = socket.nsp;
    console.log("login", newNamespace);
    onlineMap[socket.nsp.name][socket.id] = data.id;
    newNamespace.emit("onlineList", Object.values(onlineMap[socket.nsp.name]));
    data.channels.forEach((channel) => {
      console.log("join", socket.nsp.name, channel);
      socket.join(`${socket.nsp.name}-${channel}`);
    });
  }

  afterInit(server: Server): void {
    console.log("websocket server init", server);
  }

  handleConnection(@ConnectedSocket() socket: Socket): void {
    console.log("connected", socket.nsp.name);
    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }
    socket.emit("hello", socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    console.log("disconnected", socket.nsp.name);
    const newNamespace = socket.nsp;
    delete onlineMap[socket.nsp.name][socket.id];
    newNamespace.emit("onlineList", Object.values(onlineMap[socket.nsp.name]));
  }
}
