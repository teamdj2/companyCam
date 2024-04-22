import { sendLogToSlack } from "./exceptionHandler.js";
import { Project } from "./pushexisting.js";

const findExistingProjects = async (url: string, AT: string| undefined, requestBody: Project): Promise<Project[]> => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AT}`
            }
        });

        if (response.status === 200 || response.status === 201) {
            const rawResponse = await response.text();
            const projects: Project[] = JSON.parse(rawResponse);

            const matchingProjects = projects.filter((project) => {
                return (project.name === requestBody.name);
            });            
           // console.log(matchingProjects);
            return matchingProjects;
        } else {
            await sendLogToSlack(`failed : ${response.status}`)
            throw new Error(`Failed to fetch projects from CompanyCam. Status code: ${response.status}`);
        }
    } catch (error) {
        await sendLogToSlack(error)
        console.error('An error occurred:', error);
        throw error;
    }
};

export default findExistingProjects;