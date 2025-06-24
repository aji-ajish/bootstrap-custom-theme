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
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js', array(), null, true);
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
    register_block_type_from_metadata(__DIR__ . '/blocks/card');
}
add_action('init', 'bootstrap_custom_theme_register_blocks');

// block manager

// Register admin menu page
function bootstrap_custom_theme_add_admin_menu() {
    add_theme_page(
        'Block Manager',            // Page title
        'Block Manager',            // Menu title
        'manage_options',           // Capability
        'block-manager',            // Menu slug
        'bootstrap_custom_theme_block_manager_page' // Callback function
    );
}
add_action('admin_menu', 'bootstrap_custom_theme_add_admin_menu');



function bootstrap_custom_theme_block_manager_page() {
    $registry = WP_Block_Type_Registry::get_instance();
    $blocks = $registry->get_all_registered();
    $allowed_blocks = get_option('bct_allowed_blocks', []);
    $categories = [];

    // Group blocks by category
    foreach ($blocks as $block_name => $block_type) {
        $category = $block_type->category ?? 'uncategorized';
        if (!isset($categories[$category])) {
            $categories[$category] = [];
        }
        $categories[$category][$block_name] = $block_type;
    }

    echo '<div class="wrap"><h1>Block Manager</h1>';
    echo '<form method="POST">';
    wp_nonce_field('bct_save_blocks', 'bct_nonce');

    // Inline styles and scripts
    echo '<style>
        .bct-toggle {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        .bct-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .bct-slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        .bct-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        .bct-toggle input:checked + .bct-slider {
            background-color: #007cba;
        }
        .bct-toggle input:checked + .bct-slider:before {
            transform: translateX(26px);
        }
        .bct-block-row {
            display: flex;
            align-items: center;
            margin: 6px 0;
        }
        .bct-category {
            margin-top: 2em;
            font-size: 1.2em;
            font-weight: bold;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    </style>';

    echo '<script>
        document.addEventListener("DOMContentLoaded", function () {
            const groupToggles = document.querySelectorAll(".bct-group-toggle");
            groupToggles.forEach(toggle => {
                toggle.addEventListener("change", function () {
                    const category = this.dataset.category;
                    const checkboxes = document.querySelectorAll(`.bct-block[data-category="${category}"] input`);
                    checkboxes.forEach(cb => cb.checked = this.checked);
                });
            });
        });
    </script>';

    foreach ($categories as $category => $block_list) {
        $human_category = ucwords(str_replace(['-', '_'], ' ', $category));
        echo '<div class="bct-category">';
        echo '<span>' . esc_html($human_category) . '</span>';
        echo '<label class="bct-toggle">';
        echo '<input type="checkbox" class="bct-group-toggle" data-category="' . esc_attr($category) . '" checked>';
        echo '<span class="bct-slider"></span>';
        echo '</label>';
        echo '</div>';

        foreach ($block_list as $block_name => $block_type) {
            $checked = in_array($block_name, $allowed_blocks) ? 'checked' : '';
            echo '<div class="bct-block-row bct-block" data-category="' . esc_attr($category) . '">';
            echo '<label class="bct-toggle">';
            echo '<input type="checkbox" name="bct_blocks[]" value="' . esc_attr($block_name) . '" ' . $checked . '>';
            echo '<span class="bct-slider"></span>';
            echo '</label>';
            echo '<span style="margin-left:12px;">' . esc_html($block_name) . '</span>';
            echo '</div>';
        }
    }

    echo '<p><input type="submit" class="button button-primary" value="Save Changes"></p>';
    echo '</form></div>';
}





add_action('admin_init', function () {
    if (isset($_POST['bct_blocks']) && check_admin_referer('bct_save_blocks', 'bct_nonce')) {
        $selected_blocks = array_map('sanitize_text_field', $_POST['bct_blocks']);
        update_option('bct_allowed_blocks', $selected_blocks);
    }
});
add_filter('allowed_block_types_all', function ($allowed_blocks, $editor_context) {
    if (!is_admin()) return $allowed_blocks;
    $saved_blocks = get_option('bct_allowed_blocks', []);
if (empty($saved_blocks)) {
    // Allow all blocks by default
    $registry = WP_Block_Type_Registry::get_instance();
    $saved_blocks = array_keys($registry->get_all_registered());
}
return $saved_blocks;

}, 10, 2);


