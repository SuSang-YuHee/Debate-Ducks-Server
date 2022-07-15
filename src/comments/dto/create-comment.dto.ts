export class CreateCommentDto {
  target_user: string;
  target_debate: number;
  pros: boolean;
  contents: string;
}
