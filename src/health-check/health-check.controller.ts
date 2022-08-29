import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";

@Controller("health-check")
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          "debate-ducks-client",
          "https://debate-ducks.click",
        ),
      () => this.db.pingCheck("database"),
    ]);
  }
}
3;
