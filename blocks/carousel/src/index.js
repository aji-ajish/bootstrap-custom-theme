import '../../carousel/src/carousel-item'; // Register child first

import { registerBlockType } from '@wordpress/blocks';
import metadata from '../block.json';
import Edit from './edit';
import Save from './save';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: Save,
});
