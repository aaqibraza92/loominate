import { PageData } from "./page.model";

export interface LeaderBoardData extends PageData {
  timeline?: "ALL" | "WEEK" | "MONTH";
  below?: boolean;
}
