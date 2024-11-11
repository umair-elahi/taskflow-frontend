export const constants = {
    messages: {
        SERVER_ERROR: 'Something bad happened on server.',
        ROLE_SAVE_SUCCESS: 'Role successfully saved.',
        ROLE_DELETE_SUCCESS: 'Role successfully deleted.',
        USER_SAVE_SUCCESS: 'User successfully saved.',
        USER_DELETE_SUCCESS: 'User successfully deleted.',
        OFFICE_LOCATION_SAVE_SUCCESS: 'Office Location successfully saved.',
        OFFICE_LOCATION_DELETE_SUCCESS: 'Office Location successfully deleted.',
        DEPARTMENT_SAVE_SUCCESS: 'Department successfully saved.',
        DEPARTMENT_DELETE_SUCCESS: 'Department successfully deleted.',
        GROUP_SAVE_SUCCESS: 'Group successfully saved.',
        GROUP_DELETE_SUCCESS: 'Group successfully deleted.',
        DELETE_WARNING_TITLE: 'Confirm Delete?',
        DELETE_WARNING_TEXT: 'Are you sure you want to delete?',
        PASSWORD_SAVE_SUCCESS: 'Password successfully updated',
        PROFILE_UPDATED: 'Profile successfully updated',
        APPLICATION_SAVE_SUCCESS: 'Application successfully saved.',
        APPLICATION_DELETE_SUCCESS: 'Application successfully deleted.',
        APPLICATION_PUBLISH_SUCCESS: 'Application has been published.',
        APPLICATION_FORM_SAVE_SUCCESS: 'Application form successfully saved.',
        APPLICATION_FORM_DELETE_SUCCESS: 'Application form successfully deleted.',
        APPLICATION_WORKFLOW_SAVE_SUCCESS: 'Application workflow successfully saved.',
        APPLICATION_WORKFLOW_DELETE_SUCCESS: 'Application workflow successfully deleted.',
        APPLICATION_PERMISSIONS_SAVE_SUCCESS: 'Application permissions successfully saved.',
        LIST_SAVE_SUCCESS: 'List successfully saved.',
        LIST_DELETE_SUCCESS: 'List successfully deleted.',
        LIST_DATA_SAVE_SUCCESS: 'List Data successfully saved.',
        LIST_DATA_DELETE_SUCCESS: 'List Data successfully deleted.',
        ALL_FIELDS_REQUIRED: '* fields are required. Please check',
        EXECUTION_SAVE_SUCCESS: 'Workflow excution has been saved',
        EXECUTION_DELETE_SUCCESS: 'Workflow excution has been deleted',
        ACCESS_DENIED: 'Your are not authorize to perform this action',
        PUBLISH_SUCCESS: 'Details has been published',
        // tslint:disable-next-line: max-line-length
        PUBLISH_APPLICATION_WARNING: 'Are you sure you want to publish this application? Once you publish this app users will be able to initiate this workflow.',
        // tslint:disable-next-line: max-line-length
        PUBLISH_EXECUTION_WARNING: 'Are you sure you want to publish this details? Once you publish this, details will be forwarded to next consultant person.',
        APPROVE_SUCCESS: 'Details has been approved',
        CLARITY_SUCCESS: 'Details has been sent for clarification',
        REJECT_SUCCESS: 'Details has been rejected',
        REASSIGN_SUCCESS: 'Details has been re-assigned to user',
        COMMENT_REQUIRED: 'Comment is required',
        WITHDRAW_SUCCESS: 'Your request has withdraw successfully'
    },
    voucherfieldTypes: {
        CP: 'Cash Payment Voucher',
        BP: 'Bank Payment Voucher',
        CR: 'Cash Receipt Voucher',
        BR: 'Bank Receipt Voucher',
        JV: 'Journal Voucher'
    },
    basicFields: [
        {
            name: 'Text',
            templateOptions: {
                type: 'input'
            },
            type: 'input',
            icon: 'fas fa-text-width',
            templateName: 'input_text'
        },
        {
            name: 'Text Area',
            templateOptions: {
                type: 'textarea',
                rows: 5
            },
            type: 'textarea',
            icon: 'fas fa-paragraph',
            templateName: 'input_textarea'
        },
        {
            name: 'Number',
            templateOptions: {
                type: 'number'
            },
            type: 'input',
            icon: 'fas fa-sort-numeric-up',
            templateName: 'input_number'
        },
        {
            name: 'Currency',
            templateOptions: {
                type: 'number'
            },
            type: 'input',
            icon: 'fas fa-dollar-sign',
            templateName: 'input_currency'
        },
        {
            name: 'Date',
            templateOptions: {
                type: 'date'
            },
            type: 'input',
            icon: 'fas fa-calendar-plus',
            templateName: 'input_date'
        },
        {
            name: 'Time',
            templateOptions: {
                type: 'time'
            },
            type: 'input',
            icon: 'fas fa-clock',
            templateName: 'input_datetime'
        },
        {
            name: 'Yes/No',
            templateOptions: {
                type: 'radio',
                options: [
                    { value: 'No', label: 'No' },
                    { value: 'Yes', label: 'Yes' }
                ]
            },
            type: 'radio',
            icon: 'fas fa-toggle-on',
            templateName: 'input_radio'
        },
        {
            name: 'Dropdown',
            templateOptions: {
                type: 'select'
            },
            type: 'select',
            icon: 'fas fa-chevron-down',
            templateName: 'input_dropdown'
        },
        {
            name: 'Checkbox',
            templateOptions: {
                type: 'multicheckbox'
            },
            type: 'multicheckbox',
            icon: 'fas fa-check-square',
            templateName: 'input_checkbox'
        },
        {
            name: 'Attachment',
            templateOptions: {
                type: 'file'
            },
            type: 'input',
            icon: 'fas fa-paperclip',
            templateName: 'input_attachment'
        },
        {
            name: 'Users',
            templateOptions: {
                type: 'select',
                isUser: true
            },
            type: 'select',
            icon: 'fas fa-chevron-down',
            templateName: 'input_users'
        },
        {
            name: 'Department wise Users',
            templateOptions: {
                type: 'select',
                isUser: true
            },
            type: 'select',
            icon: 'fas fa-chevron-down',
            templateName: 'input_department_users'
        }
    ],
    templateOptions: {
        input_text: [
            {
                key: 'fieldId',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Id',
                    placeholder: 'Field Id',
                    required: true,
                }
            },
            {
                key: 'name',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Name',
                    placeholder: 'Field Name',
                    required: true,
                }
            },
            {
                key: 'required',
                type: 'checkbox',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Is this a required field?',
                    required: true,
                }
            },
            {
                key: 'defaultValue',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Default Value',
                    placeholder: 'Default Value',
                    required: false,
                }
            },
            {
                key: 'helpText',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Help Text',
                    placeholder: 'Help Text',
                    required: false,
                }
            },
            {
                key: 'maxLength',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    type: 'number',
                    label: 'Maximum Number Of Characters',
                    placeholder: 'Maximum Number Of Characters',
                    required: true,
                }
            }
        ],
        input_textarea: [
            {
                key: 'fieldId',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Id',
                    placeholder: 'Field Id',
                    required: true,
                }
            },
            {
                key: 'name',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Name',
                    placeholder: 'Field Name',
                    required: true,
                }
            },
            {
                key: 'required',
                type: 'checkbox',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Is this a required field?',
                    required: true,
                }
            },
            {
                key: 'defaultValue',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Default Value',
                    placeholder: 'Default Value',
                    required: false,
                }
            },
            {
                key: 'helpText',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Help Text',
                    placeholder: 'Help Text',
                    required: false,
                }
            },
            {
                key: 'maxLength',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    type: 'number',
                    label: 'Maximum Number Of Characters',
                    placeholder: 'Maximum Number Of Characters',
                    required: true,
                }
            }
        ],
        input_number: [
            {
                key: 'fieldId',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Id',
                    placeholder: 'Field Id',
                    required: true,
                }
            },
            {
                key: 'name',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Name',
                    placeholder: 'Field Name',
                    required: true,
                }
            },
            {
                key: 'required',
                type: 'checkbox',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Is this a required field?',
                    required: true,
                }
            },
            {
                key: 'defaultValue',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Default Value',
                    placeholder: 'Default Value',
                    required: false,
                }
            },
            {
                key: 'helpText',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Help Text',
                    placeholder: 'Help Text',
                    required: false,
                }
            },
            {
                key: 'maxLength',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    type: 'number',
                    label: 'Maximum Number Of Characters',
                    placeholder: 'Maximum Number Of Characters',
                    required: true,
                }
            },
            {
                key: 'decimalPlaces',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    type: 'number',
                    label: 'Decimal Places',
                    placeholder: 'Decimal Places',
                    required: true,
                }
            }
        ],
        input_currency: [
            {
                key: 'fieldId',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Id',
                    placeholder: 'Field Id',
                    required: true,
                }
            },
            {
                key: 'name',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Name',
                    placeholder: 'Field Name',
                    required: true,
                }
            },
            {
                key: 'required',
                type: 'checkbox',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Is this a required field?',
                    required: true,
                }
            },
            {
                key: 'defaultValue',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Default Value',
                    placeholder: 'Default Value',
                    required: false,
                }
            },
            {
                key: 'helpText',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Help Text',
                    placeholder: 'Help Text',
                    required: false,
                }
            },
            {
                key: 'maxLength',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    type: 'number',
                    label: 'Maximum Number Of Characters',
                    placeholder: 'Maximum Number Of Characters',
                    required: true,
                }
            },
            {
                key: 'decimalPlaces',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    type: 'number',
                    label: 'Decimal Places',
                    placeholder: 'Decimal Places',
                    required: true,
                }
            }
        ],
        input_date: [
            {
                key: 'fieldId',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Id',
                    placeholder: 'Field Id',
                    required: true,
                }
            },
            {
                key: 'name',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Name',
                    placeholder: 'Field Name',
                    required: true,
                }
            },
            {
                key: 'required',
                type: 'checkbox',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Is this a required field?',
                    required: true,
                }
            },
            {
                key: 'helpText',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Help Text',
                    placeholder: 'Help Text',
                    required: false,
                }
            }
        ],
        input_datetime: [
            {
                key: 'fieldId',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Id',
                    placeholder: 'Field Id',
                    required: true,
                }
            },
            {
                key: 'name',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Name',
                    placeholder: 'Field Name',
                    required: true,
                }
            },
            {
                key: 'required',
                type: 'checkbox',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Is this a required field?',
                    required: true,
                }
            },
            {
                key: 'helpText',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Help Text',
                    placeholder: 'Help Text',
                    required: false,
                }
            }
        ],
        input_radio: [
            {
                key: 'fieldId',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Id',
                    placeholder: 'Field Id',
                    required: true,
                }
            },
            {
                key: 'name',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Name',
                    placeholder: 'Field Name',
                    required: true,
                }
            },
            {
                key: 'required',
                type: 'checkbox',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Is this a required field?',
                    required: true,
                }
            },
            {
                key: 'defaultValue',
                type: 'select',
                modelOptions: { updateOn: 'blur' }, templateOptions: {
                    label: 'Default Value',
                    required: false,
                    options: [{
                        id: 'Yes',
                        name: 'Yes'
                    }, {
                        id: 'No',
                        name: 'No'
                    }],
                    valueProp: 'id',
                    labelProp: 'name'
                }
            },
            {
                key: 'helpText',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Help Text',
                    placeholder: 'Help Text',
                    required: false,
                }
            }
        ],
        input_dropdown: [
            {
                key: 'fieldId',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Id',
                    placeholder: 'Field Id',
                    required: true,
                }
            },
            {
                key: 'name',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Name',
                    placeholder: 'Field Name',
                    required: true,
                }
            },
            {
                key: 'required',
                type: 'checkbox',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Is this a required field?',
                    required: true,
                }
            },
            {
                key: 'defaultValue',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Default Value',
                    placeholder: 'Default Value',
                    required: false,
                }
            },
            {
                key: 'helpText',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Help Text',
                    placeholder: 'Help Text',
                    required: false,
                }
            },
            {
                key: 'lookupId',
                type: 'select',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Create dropdown from an existing list',
                    options: [],
                    valueProp: 'id',
                    labelProp: 'name'
                }
            }
        ],
        input_checkbox: [
            {
                key: 'fieldId',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Id',
                    placeholder: 'Field Id',
                    required: true,
                }
            },
            {
                key: 'name',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Name',
                    placeholder: 'Field Name',
                    required: true,
                }
            },
            {
                key: 'required',
                type: 'checkbox',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Is this a required field?',
                    required: true,
                }
            },
            {
                key: 'helpText',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Help Text',
                    placeholder: 'Help Text',
                    required: false,
                }
            },
            {
                key: 'lookupId',
                type: 'select',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Create dropdown from an existing list',
                    options: [],
                    valueProp: 'id',
                    labelProp: 'name'
                }
            }
        ],
        input_attachment: [
            {
                key: 'fieldId',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Id',
                    placeholder: 'Field Id',
                    required: true,
                }
            },
            {
                key: 'name',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Name',
                    placeholder: 'Field Name',
                    required: true,
                }
            },
            {
                key: 'required',
                type: 'checkbox',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Is this a required field?',
                    required: true,
                }
            },
            {
                key: 'helpText',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Help Text',
                    placeholder: 'Help Text',
                    required: false,
                }
            }
        ],
        input_users: [
            {
                key: 'fieldId',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Id',
                    placeholder: 'Field Id',
                    required: true,
                }
            },
            {
                key: 'name',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Name',
                    placeholder: 'Field Name',
                    required: true,
                }
            },
            {
                key: 'required',
                type: 'checkbox',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Is this a required field?',
                    required: true,
                }
            },
            {
                key: 'helpText',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Help Text',
                    placeholder: 'Help Text',
                    required: false,
                }
            }
        ],
        input_department_users: [
            {
                key: 'lookupId',
                type: 'select',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Select Department',
                    options: [],
                    required: true,
                    valueProp: 'id',
                    labelProp: 'name'
                }
            },
            {
                key: 'fieldId',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Id',
                    placeholder: 'Field Id',
                    required: true,
                }
            },
            {
                key: 'name',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Field Name',
                    placeholder: 'Field Name',
                    required: true,
                }
            },
            {
                key: 'required',
                type: 'checkbox',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Is this a required field?',
                    required: true,
                }
            },
            {
                key: 'helpText',
                type: 'input',
                modelOptions: { updateOn: 'blur' },
                templateOptions: {
                    label: 'Help Text',
                    placeholder: 'Help Text',
                    required: false,
                }
            }
        ]
    },
    lookupListTemplateName: {
        DROPDOWN: 'input_dropdown',
        CHECKBOX: 'input_checkbox',
        FILE: 'input_attachment',
        USERS: 'input_users',
        DEPARTMENT: 'input_department_users'
    },
    permissionTypes: {
        NEW: 'new',
        INITIATOR_SUMMARY: 'initiator_summary',
        ALL_TASK: 'all_task',
        WORKFLOW: 'workflow'
    },
    workflowTypes: {
        APPROVAL: 'approval',
        INPUT: 'input',
        GOTO: 'goto',
        BRANCHES: 'branches'
    },
    permissions: {
        VISIBLE: 'visible',
        EDITABLE: 'editable',
        READONLY: 'readonly',
        HIDDEN: 'hidden',
        CONDITIONAL: 'conditional'
    },
    executionStatus: {
        DRAFT: 'draft',
        CLARITY: 'clarity',
        REJECT: 'reject',
        APPROVED: 'approved',
        PARTICIPATED: 'participated',
        WORKLOAD: 'WORKLOAD',
        WITHDRAW: 'withdraw',
        INPROGRESS: 'inProgress'
    },
    executionStatuses: [
        {
            name: 'All',
            value: 'all'
        },
        {
            name: 'Draft',
            value: 'draft'
        },
        {
            name: 'Clarity',
            value: 'clarity'
        },
        {
            name: 'Rejected',
            value: 'reject'
        },
        {
            name: 'Approved',
            value: 'approved'
        },
        {
            name: 'Withdraw',
            value: 'withdraw'
        },
        {
            name: 'In Progress',
            value: 'inProgress'
        }
    ]
};
