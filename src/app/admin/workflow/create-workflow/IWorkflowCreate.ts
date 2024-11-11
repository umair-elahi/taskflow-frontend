export interface IBasicFields {
    name: String;
    templateOptions: {
        type: String
    };
    type: String;
    icon: String;
    templateName: String;
}

export interface IWorkflowFields {
    key: String;
    type: String;
    name: String;
    templateOptions: {};
    icon: String;
}

export interface ISaveApplication {
    id: string;
    name: string;
    shortDescription: string;
    userIds: string;
    canAllStart: boolean;
    canAllEdits: boolean;
    editableUserIds: string;
}

export interface IApplicationWorkflow {
    id: string;
    applicationId: string;
    name: string;
    showMap: boolean;
    canWithdraw: boolean;
    type: string;
    userIds?: string[];
    order: number;
    stepId: string;
    assignTo: string;
    showAssignToOption: boolean;
    groupId?: Number;
}

export interface IApplicationWorkflowFieldPermission {
    id?: string;
    applicationId?: string;
    applicationWorkflowId?: string;
    applicationFormSectionId?: string;
    applicationFormFieldId?: string;
    permission?: string;
    type?: string;
    conditions?: any;
}
