interface Category {
  id?: string;
  name?: string;
  color?: string;
  imageUrl?: string;
  active?: boolean;
  selected?: boolean;
  if_followed?: boolean;
  count_posts?: number;
  count_polls?: number;
  count_initiatives?: number;
  created_at?: string;
  updated_at?: string;
  title?: string
}

export enum CategoryOrder {
  Popular = "Popular",
  Trending = "Trending",
  Alphabetically = "A-Z",
  AlphabeticallyReverse = "Z-A",
}

export default Category;
