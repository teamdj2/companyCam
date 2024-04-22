import fetch from 'node-fetch';
import usersMap from './userMap';
import { response } from 'express';

// var dotenv = require('dotenv').config({ path: require('find-config')('.env') });

const assignUser = async (owner: string | number, projectId: string, accessToken: string) => {
        const userId = usersMap[owner];
        if (!userId || userId === "3159650") {
          console.error(`User ID not found for owner: ${owner}`);
          return null;
        }
        if(userId){
           // console.log(userId, owner);
            const url1 = `https://api.companycam.com/v2/projects/${projectId}/assigned_users/${userId}`;
            //const url2 = `https://api.companycam.com/v2/projects/${projectId}/assigned_users/3159650`;
            //console.log(url1, /*url2*/);
            const response1 = await fetch(url1, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
        }
}
//Khalig: '3159650'
export default assignUser;