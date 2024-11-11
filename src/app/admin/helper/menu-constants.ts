import { ApplicationWorkflowType } from './enum';
import { constants } from './constants';

export const MenuConstants = [
    {
        Name: 'Workflow',
        Icon: 'fas fa-network-wired',
        DefaultLink: '',
        Childrens: [
            {
                Name: 'Dashboard',
                Icon: 'fa-tachometer-alt',
                Link: ['/workflow', 'dashboard']
            },
            {
                Name: 'Apps',
                Icon: 'fa-cogs',
                Link: ['/workflow', 'list']
            },
            {
                Name: 'Approvals',
                Icon: 'fa-check-circle',
                Link: ['/workflow', 'approvals', 'all'],
                count: 'approval'
            },
            {
                Name: 'Input Requests',
                Icon: 'fa-pencil-alt',
                Link: ['/workflow', 'input-request', 'all'],
                count: 'inputRequest'
            },
            {
                Name: 'In Progress',
                Icon: 'fa-tasks',
                Link: ['/workflow', 'inprogress', 'all'],
                count: 'inprogress'
            },
            {
                Name: 'Clarifications',
                Icon: 'fa-comments',
                Link: ['/workflow', 'clarification', 'all'],
                count: 'clarification'
            },
            {
                Name: 'Participated',
                Icon: 'fa-user-edit',
                Link: ['/workflow', 'participated'],
                count: 'participated'
            },
            {
                Name: 'Draft',
                Icon: 'fa-edit',
                Link: ['/workflow', 'draft', 'all'],
                count: 'draft'
            },
            {
                Name: 'Approved',
                Icon: 'fa-clipboard-check',
                Link: ['/workflow', 'approved', 'all'],
                count: 'approved'
            },
            {
                Name: 'Rejected',
                Icon: 'fa-ban',
                Link: ['/workflow', 'rejected', 'all'],
                count: 'reject'
            },
            {
                Name: 'Withdraw',
                Icon: 'fa-times',
                Link: ['/workflow', 'withdraw'],
                count: 'withdraw'
            },
            {
                Name: 'Delete Exceutions',
                Icon: 'fa-times',
                Link: ['/workflow', 'delete-executions']
            }
        ],
    },
    {
        Name: 'Admin',
        Icon: 'fa-cogs',
        DefaultLink: '',
        Childrens: [
            {
                Name: 'Dashboard',
                Icon: 'fa-tachometer-alt',
                Link: ['/admin', 'dashboard']
            },
            {
                Name: 'Office Location',
                Icon: 'fa-building',
                Link: ['/admin', 'office-location']
            },
            {
                Name: 'Departments',
                Icon: 'fa-building',
                Link: ['/admin', 'departments']
            },
            {
                Name: 'Groups',
                Icon: 'fa-building',
                Link: ['/admin', 'groups']
            },
            {
                Name: 'Lists',
                Icon: 'fa-list',
                Link: ['/admin', 'lists']
            },
            {
                Name: 'Users',
                Icon: 'fa-users',
                Link: ['/admin', 'users']
            },
            {
                Name: 'Roles',
                Icon: 'fa-users-cog',
                Link: ['/admin', 'roles']
            }
        ],
    },
    {
        Name: 'Report',
        Icon: 'fa-cogs',
        DefaultLink: '',
        Childrens: [
            {
                Name: 'My Items',
                Icon: 'fa-tachometer-alt',
                Link: ['/report', 'my-item']
            },
            {
                Name: 'User Workload',
                Icon: 'fa-building',
                Link: ['/report', 'user-summary']
            },
            {
                Name: 'Application Timeline',
                Icon: 'fa-building',
                Link: ['/report', 'app-timeline']
            },
            {
                Name: 'Application Metrics',
                Icon: 'fa-building',
                Link: ['/report', 'app-metrics']
            },
            {
                Name: 'Application Location',
                Icon: 'fa-building',
                Link: ['/report', 'app-location']
            },
            {
                Name: 'User Location',
                Icon: 'fa-building',
                Link: ['/report', 'user-location']
            },
            {
                Name: 'Withdraw',
                Icon: 'fa-times',
                Link: ['/workflow', 'withdraw'],
                count: 'withdraw'
            }
        ],
    }
];
