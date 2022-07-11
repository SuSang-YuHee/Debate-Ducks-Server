export class UpdateDebateDto {
  id: number;
  author: string;
  title: string;
  contents: string;
  category: string;
  video_url: string;
  participant: string;
  author_pros: boolean;
  created_date: Date;
  updated_date: Date;
  ended_date: Date;
}
