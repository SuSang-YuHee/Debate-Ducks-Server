export class CreateAlarmDto {
  sender: string;
  receiver: string;
  title: string;
  contents: string;
  target_debate: number;
  target_comment: number;
}
