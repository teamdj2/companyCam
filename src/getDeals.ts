import * as dotenv from 'dotenv';
import * as Types from './types.js';
import { sendLogToSlack } from './exceptionHandler.js';
dotenv.config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

export const getAllDeals = async (): Promise<Types.Deal[]> => {
    const url: string = process.env["URL"] + '/data';
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            console.log("All deals:", data);
            return data;
        } else {
            console.log("The response is not an array or it's empty.");
            return [];
        };
    } catch (error) {
        await sendLogToSlack(error)
        console.error("An error occurred:", error);
        return [];
    }
};

export default getAllDeals;