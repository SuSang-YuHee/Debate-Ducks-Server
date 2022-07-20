export class CreateCommentDto {
  target_user_id: string;
  target_debate_id: number;
  pros: boolean;
  contents: string;
}
