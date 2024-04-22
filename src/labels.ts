import { sendLogToSlack } from "./exceptionHandler.js";
import { Label } from "./updateLabel.js";
var dotenv = require('dotenv').config({ path: require('find-config')('.env') });
const postLabelsToProject = async (projectId: string | number | undefined, labels: string[] | number[] | Label[], accessToken: string| undefined): Promise<Response> => {
    const baseUrl= process.env['CC_URL']
    const url = `https://api.companycam.com/v2/projects/${projectId}/labels`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                project: {
                    labels: labels
                }
            })
        });

        return response;
    } catch (error) {
        await sendLogToSlack(error)
        console.error('An error occurred while posting labels:', error);
        throw error;
    }
};

export default postLabelsToProject;