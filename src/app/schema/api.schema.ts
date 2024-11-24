type SuccessResponse = {
    status: number;
    payload: any;
    message: string;
}

type ErrorResponse = {
    status: number;
    message: string;
}

export type { SuccessResponse, ErrorResponse };