<?php
function render_tabs_block($attributes, $content) {
    $custom_id = !empty($attributes['customId']) ? $attributes['customId'] : 'tabs-' . wp_generate_uuid4();
    $orientation = !empty($attributes['orientation']) ? $attributes['orientation'] : 'horizontal';
    $tab_style = !empty($attributes['tabStyle']) ? $attributes['tabStyle'] : 'nav-tabs';
    $custom_class = !empty($attributes['customClass']) ? $attributes['customClass'] : '';

    // Extract all buttons and tab panes using regex
    preg_match_all('/<button.*?<\/button>/s', $content, $buttons);
    preg_match_all('/<div class="tab-pane.*?<\/div>/s', $content, $panes);

    $nav_class = $orientation === 'vertical'
        ? 'nav flex-column nav-pills me-3'
        : "nav {$tab_style}";

    ob_start();
    ?>
    <div id="<?php echo esc_attr($custom_id); ?>" class="tabs-block <?php echo esc_attr($custom_class); ?>">
      <div class="d-flex align-items-start">
        <nav>
          <div class="<?php echo esc_attr($nav_class); ?>" role="tablist" aria-orientation="<?php echo esc_attr($orientation); ?>">
            <?php foreach ($buttons[0] as $btn) {
              echo $btn;
            } ?>
          </div>
        </nav>
        <div class="tab-content flex-grow-1">
          <?php foreach ($panes[0] as $pane) {
            echo $pane;
          } ?>
        </div>
      </div>
    </div>
    <?php
    return ob_get_clean();
}
