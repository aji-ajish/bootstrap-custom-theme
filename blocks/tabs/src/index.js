import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import Save from './save';
import './style.css';

registerBlockType('bootstrap-custom-theme/tabs', {
    title: __('Bootstrap Tabs', 'bootstrap-custom-theme'),
    category: 'custom-blocks',
    icon: 'excerpt-view',
    attributes: {
        tabs: {
            type: 'array',
            default: [
                { title: 'Tab 1', active: true },
                { title: 'Tab 2', active: false }
            ]
        },
        orientation: {
            type: 'string',
            default: 'horizontal'
        },
        style: {
            type: 'string',
            default: 'tabs'
        },
        clientId: {
            type: 'string',
            default: ''
        }
    },
    edit: Edit,
    save: Save
});