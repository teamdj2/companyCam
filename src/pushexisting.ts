import * as dotenv from 'dotenv';
import * as Types from './types.js';
import { getAllDeals } from './getDeals.js';
import createProjects from './createProjects.js';
import findExistingProjects from './findExisting.js';
import postLabelsToProject from './labels.js';
import updateProjectLabel from './updateLabel.js';
import { stageToLabelMap } from './stageLabelsToMap.js';
import { sendLogToSlack } from './exceptionHandler.js';
import usersMap from './userMap.js';
import assignUser from './assignUser.js';
import putToCC from './putToCC.js';

dotenv.config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

export interface Project {
    id?: string | number,
    name: string,
    status: string,
    address: {
        street_address_1: string,
        city: string,
        state: string,
        postal_code: string,
        country: "US",
    },
    primary_contact: {
        name: string,
        email: string,
        phone_number: string,
    }
} 

export const postExistingToCompanyCamIfNotExists = async (allDeals: Types.Deal[]) => {
    try {
        const url = process.env['CC_URL'] + '/projects';
        const accessToken = process.env['COMPANY_CAM_ACCESS_TOKEN'];

        //const allDeals: Types.Deal[] = await getAllDeals();

        const projectsToCreate: Project[] = [];
        const usedProjects: Project[] = [];
        const NullValue = "UNKNOWN";
        for (const deal of allDeals) {
            let fullName = deal.contact_name1 + deal.contact_name2;
            let personName = deal.contact_name1 + deal.contact_name2 == "" ? NullValue : fullName;
            let stage = deal.stage;
            //console.log(fullName);
            //console.log(personName);
            const requestBody: Project = {
                name: deal.name || NullValue,
                status: '',
                address: {
                    street_address_1: deal.street_address_1 || NullValue,
                    city: deal.city || NullValue,
                    state: deal.state || NullValue,
                    postal_code: deal.postal_code || NullValue,
                    country: "US",
                },
                primary_contact: {
                    name: personName || NullValue,
                    email: deal.email || NullValue,
                    phone_number: (typeof deal.phone_number === 'string') ? deal.phone_number : deal.phone_number.toString() || NullValue,
                }
            };
            const putBody: Types.PUT = {
                name: deal.name,
                address: {
                    street_address_1: deal.street_address_1 || NullValue,
                    city: deal.city || NullValue,
                    state: deal.state || NullValue,
                    postal_code: deal.postal_code || NullValue,
                    country: 'US'
                }
            } 
            console.log(`Processing deal: ${deal.name}`);
            console.log(requestBody);
            const matchingProjects = await findExistingProjects(`${url}?query=${encodeURIComponent(deal.name)}`, accessToken, requestBody);
            if (matchingProjects.length === 0) {
                projectsToCreate.push(requestBody);
            }
            else if (matchingProjects.length !== 0) {
                for (const matchingProject of matchingProjects) {
                    const projectId = matchingProject.id;

                    const stageNumber = deal.stage;
                    const labelName = stageToLabelMap[stageNumber];
                    const newLabel = labelName;
                    try {
                        await updateProjectLabel(projectId, newLabel, accessToken);
                        await putToCC(projectId, putBody, accessToken)
                        console.log(`Labels updated for project ${projectId}`);
                    } catch (error) {
                        await sendLogToSlack(error + 'failed to update labels for project: ' + projectId)
                        console.error(`Failed to update labels for project ${projectId}: ${error}`);
                    }
                }
            }
        }

        if (projectsToCreate.length > 0) {
            const responses = await createProjects(url, accessToken, projectsToCreate);

            for (let i = 0; i < responses.length; i++) {
                if (responses[i].status === 200 || responses[i].status === 201) {
                    const deal = allDeals[i];
                    const responseData = await responses[i].json();
                    console.log('Successfully created new project on CompanyCam');

                    const stageNumber = deal.stage;

                    const labelName = stageToLabelMap[stageNumber];

                    if (labelName || (typeof stageNumber === "string" && stageNumber.trim() !== "")) {
                        const labelToPost = labelName ? labelName : stageNumber;

                        await postLabelsToProject(responseData.id, [labelToPost], accessToken);
                    } else {
                        console.log("no stage found for this project");
                    };
                    const ownerFirst = deal.owner
                    const userId = usersMap[ownerFirst];
                    if(userId){
                        await assignUser(userId, responseData.id, accessToken);
                    }
                } else {
                   const messageToSlack = responses[i].toString();
                    await sendLogToSlack(messageToSlack)
                    console.error('Failed to create project on CompanyCam. Response:', responses[i]);
                }
            }
        } else {
            console.log("All projects already exist on CompanyCam.");
        };

    } catch (error) {
        await sendLogToSlack(error)
        console.error('An error occurred:', error);
    }
};