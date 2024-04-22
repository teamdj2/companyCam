import deleteLabelForProject from "./deleteLabel.js";
import getLabelsForProject from "./getLabels.js";
import postLabelsToProject from "./labels.js";
import { stageToLabelMap } from "./stageLabelsToMap.js";

export interface Label {
    id: string;
    company_id: string;
    display_value: string;
    value: string;
    created_at: number;
    updated_at: number;
    tag_type: string;
}

async function updateProjectLabel(projectId: string | number | undefined, newLabel: string, accessToken: string| undefined): Promise<void> {
    const currentLabels: Label[] = await getLabelsForProject(projectId, accessToken);
    
    if (!currentLabels || currentLabels.length === 0) {
        await postLabelsToProject(projectId, [newLabel], accessToken);
        return;
    }
    //console.log(currentLabels);
    const possibleLabelsAndKeys = [...Object.keys(stageToLabelMap), ...Object.values(stageToLabelMap)];

    const labelsToDelete = currentLabels.filter(label => possibleLabelsAndKeys.includes(label.display_value));
    
    for (const label of labelsToDelete) {
        await deleteLabelForProject(projectId, label.id, accessToken);
    }
    
    await postLabelsToProject(projectId, [newLabel], accessToken);
}

export default updateProjectLabel;
