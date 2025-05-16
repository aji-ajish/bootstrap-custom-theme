<?php
function bootstrap_custom_theme_enqueue_scripts()
{
    // Enqueue Bootstrap CSS
    wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css');

    // Enqueue custom theme styles
    wp_enqueue_style('bootstrap-custom-theme-style', get_stylesheet_uri());

    // Enqueue Bootstrap JS (if needed)
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js', array(), null, true);

    // Enqueue custom frontend tabs.js (AFTER Bootstrap JS)
    wp_enqueue_script(
        'custom-tabs-frontend',
        get_template_directory_uri() . '/assets/js/tabs.js',
        array('bootstrap-js'), // Make sure bootstrap is loaded first
        null,
        true
    );

    wp_enqueue_script(
        'custom-accordion-frontend',
        get_template_directory_uri() . '/assets/js/accordion.js',
        array('bootstrap-js'), // Depends on Bootstrap
        null,
        true
    );
}
add_action('wp_enqueue_scripts', 'bootstrap_custom_theme_enqueue_scripts');

// Add theme support for custom blocks
function bootstrap_custom_theme_setup()
{
    add_theme_support('wp-block-styles');
    add_theme_support('align-wide');
    add_theme_support('editor-styles');
    add_editor_style('editor-style.css');
    register_nav_menus([
        'primary' => __('Primary Menu', 'bootstrap-custom-theme')
    ]);
}
add_action('after_setup_theme', 'bootstrap_custom_theme_setup');

function bootstrap_custom_theme_block_categories($categories, $post)
{
    return array_merge(
        $categories,
        [
            [
                'slug'  => 'custom-blocks',
                'title' => __('Custom Blocks', 'bootstrap-custom-theme'),
                'icon'  => null,
            ],
        ]
    );
}
add_filter('block_categories_all', 'bootstrap_custom_theme_block_categories', 10, 2);


function bootstrap_custom_theme_enqueue_editor_styles()
{
    wp_enqueue_style('editor-custom-style', get_template_directory_uri() . '/editor-style.css', [], '1.0');
    // Enqueue Bootstrap CSS in the editor
    wp_enqueue_style('bootstrap-editor', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css');
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js', ['jquery'], null, true);
}
add_action('enqueue_block_editor_assets', 'bootstrap_custom_theme_enqueue_editor_styles');


require_once get_template_directory() . '/inc/class-wp-bootstrap-navwalker.php';


function bootstrap_custom_theme_register_blocks()
{
    register_block_type_from_metadata(__DIR__ . '/blocks/simple-block');
    register_block_type_from_metadata(__DIR__ . '/blocks/container');
    register_block_type_from_metadata(__DIR__ . '/blocks/row');
    register_block_type_from_metadata(__DIR__ . '/blocks/column');
    register_block_type_from_metadata(__DIR__ . '/blocks/accordion');
    register_block_type_from_metadata(__DIR__ . '/blocks/accordion/accordion-item');
    register_block_type_from_metadata(__DIR__ . '/blocks/tabs');
    register_block_type_from_metadata(__DIR__ . '/blocks/tabs/tab-item');
    register_block_type_from_metadata(__DIR__ . '/blocks/button');
}
add_action('init', 'bootstrap_custom_theme_register_blocks');

