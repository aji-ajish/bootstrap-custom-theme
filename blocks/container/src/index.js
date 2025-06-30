import Edit from './edit';
import Save from './save';
import './style.css';

import { registerBlockType } from '@wordpress/blocks';
import metadata from '../block.json';

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: Save,
});
