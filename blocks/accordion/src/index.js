import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import Save from './save';
import './style.css';

registerBlockType('bootstrap-custom-theme/accordion', {
  title: __('Accordion', 'bootstrap-custom-theme'),
  category: 'custom-blocks',
  icon: 'list-view',
  attributes: {
    accordionType: {
      type: 'string',
      default: 'accordion-flush',
    },
    numAccordions: {
      type: 'number',
      default: 1,
    },
    accordionClass: {
      type: 'string',
      default: '',
    },
  },
  edit: Edit,
  save: Save,
});
