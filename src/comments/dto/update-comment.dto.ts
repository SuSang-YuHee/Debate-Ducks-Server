export class UpdateCommentDto {
  id: number;
  target_user: string;
  target_debate: number;
  pros: boolean;
  contents: string;
}
