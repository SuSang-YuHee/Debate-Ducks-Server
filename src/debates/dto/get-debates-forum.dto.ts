export class GetDebatesDto {
  order: "ASC" | "DESC";
  count: number;
  page: number;
  category: string[];
}
