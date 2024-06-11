export interface RequestPagenation {
  page: number;
  per: number;
}

export interface ResponsePagenation {
  currentPage: number;
  totalItemCount: number;
  totalPages?: number;
}