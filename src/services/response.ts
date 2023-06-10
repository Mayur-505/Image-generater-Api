import { Response } from "express";

export const SendSuccessResponse = (
    res: Response,
    message: string,
    data?: any,
    status: number = 200,
    statusText: string = "Success"
) => {
    return res.status(status).json({
        status: true,
        message,
        data: data
    });
};

export const SendErrorResponse = (
    res: Response,
    message: string,
    data?: any,
    status: number = 400
) => {
    return res.status(status).json({
        status: false,
        message,
        data: data,
    });
};



