import fetch from 'node-fetch';
import { PUT } from './types';
var dotenv = require('dotenv').config({ path: require('find-config')('.env') });

const putToCC = async (projectId: string | number, requestBody: PUT, accessToken: string) => {
    console.log(requestBody);
    const url = `https://api.companycam.com/v2/projects/${projectId}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    return response;
}

export default putToCC;