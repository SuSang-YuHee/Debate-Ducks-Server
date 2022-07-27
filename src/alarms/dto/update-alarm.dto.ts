export class UpdateAlarmDto {
  id: number;
  sender: string;
  receiver: string;
  title: string;
  contents: string;
  target_debate: number;
  target_comment: number;
}
