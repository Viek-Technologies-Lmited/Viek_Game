import { Module } from "@nestjs/common";
import { GatewayGateway } from "./gateway.gateway";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  providers: [GatewayGateway],
  exports: [GatewayGateway],
})
export class GatewayModule {}
