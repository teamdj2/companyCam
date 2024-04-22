import fetch from 'node-fetch';
import { sendLogToSlack } from './exceptionHandler';

async function deleteLabelForProject(projectId: string | number | undefined, labelId: string, accessToken: string| undefined): Promise<void> {
    const endpoint = `https://api.companycam.com/v2/projects/${projectId}/labels/${labelId}`;
    const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        await sendLogToSlack(`failed : ${response.status}`)
        throw new Error(`Failed to delete label ${labelId} for project ${projectId}. Status: ${response.status}`);
    }
}

export default deleteLabelForProject;