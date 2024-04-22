import fetch from 'node-fetch';

import { Label } from './updateLabel';
import { sendLogToSlack } from './exceptionHandler';

var dotenv = require('dotenv').config({ path: require('find-config')('.env') })

async function getLabelsForProject(projectId: string | number | undefined, accessToken: string| undefined): Promise<Label[]> {
//    const baseUrl = process.env["CC_URL"]
    const endpoint = `https://api.companycam.com/v2/projects/${projectId}/labels`;
    console.log(endpoint);
    console.log(endpoint);
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        const data = await response.json() //as Label[];
        console.log(data);
        return data;
    } else {
        await sendLogToSlack(`failed : ${response.status}`)
        throw new Error(`Failed to fetch labels for project ${projectId}. Status: ${response.status}`);
    }
}
getLabelsForProject('56610148', process.env["COMPANY_CAM_ACCESS_TOKEN"])
export default getLabelsForProject;
