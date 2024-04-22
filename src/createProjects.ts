import { sendLogToSlack } from "./exceptionHandler.js";
import { Project } from "./pushexisting.js";

const createProjects = async (url: string, accessToken: string| undefined, requestBodies: Project[]): Promise<Response[]> => {
    try {
        const responses = await Promise.all(requestBodies.map(async (requestBody) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(requestBody)
            });
            return response;
        }));

        return responses;
    } catch (error) {
        await sendLogToSlack(error)
        console.error('An error occurred:', error);
        throw error;
    }
};

export default createProjects;