export class CreateFactcheckDto {
  target_user_id: string;
  target_debate_id: number;
  pros: boolean;
  description: string;
  reference_url: string;
}
