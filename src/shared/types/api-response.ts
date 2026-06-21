export type ApiSuccessResponse<T> = {
  data: T;
};

export type ApiPaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

export type ApiErrorResponse = {
  error: {
    message: string;
    code: string;
  };
};
