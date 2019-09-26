import * as common from './common';
import * as nodeApi from 'azure-devops-node-api';

import * as ReleaseApi from 'azure-devops-node-api/ReleaseApi';
import * as ReleaseInterfaces from 'azure-devops-node-api/interfaces/ReleaseInterfaces';

async function getReleaseSampleJsonFile() : Promise<string>
{
    let filePath: string = await common.getOptionalEnvironmentVariable('RELEASE_DEF_JSON_PATH');

    if(!filePath)
    {
        filePath = 'samplereleasejsonwithvariables.json';
    }

    return filePath;
}
export async function run() {
    const projectId: string = common.getProject();
    const webApi: nodeApi.WebApi = await common.getWebApi();
    const releaseApiObject: ReleaseApi.IReleaseApi = await webApi.getReleaseApi();
    
    common.banner('Release Create Definition Sample');

    common.heading('Get release definitions');
    
    /*
    // Use this code block to retrieve the JSON of an existing release to create a sample JSON file
    const def1: ReleaseInterfaces.ReleaseDefinition = await releaseApiObject.getReleaseDefinition(projectId, 1);
    
    if(def1) {
        console.log('Info for definition', def1.name);

        console.log(JSON.stringify(def1));
    }
    */
    
    // Read the definition from a JSON file
    var fs = require("fs");
    var content = fs.readFileSync(await getReleaseSampleJsonFile());
    
    let def2: ReleaseInterfaces.ReleaseDefinition = <ReleaseInterfaces.ReleaseDefinition>{};
    Object.assign(def2, JSON.parse(content));

    console.log('Converted def2 to: ');
    console.log(JSON.stringify(def2));

    // Change the name of the definition to avoid collisions
    def2.name = "Created_From_Code-3";

    const definition: ReleaseInterfaces.ReleaseDefinition = await releaseApiObject.createReleaseDefinition(def2, projectId);
    console.log('Successfully created release definition: ID # ', definition.id);
}