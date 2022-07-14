import { DebateEntity } from "src/debates/entity/debate.entity";
import { UserEntity } from "src/users/entity/user.entity";

export interface FactcheckInfo {
  id: number;
  target_user: UserEntity;
  target_debate: DebateEntity;
  pros: boolean;
  description: string;
  reference_url: string;
}
