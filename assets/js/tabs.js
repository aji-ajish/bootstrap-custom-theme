document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tabs-block").forEach((tabsBlock) => {
    let nav = tabsBlock.querySelector("nav [role='tablist']");
    if (!nav) {
      nav = tabsBlock.querySelector(".nav[role='tablist']");
    }

    const content = tabsBlock.querySelector(".tab-content");

    if (!nav || !content) {
      console.warn("Skipping tabsBlock — missing nav or content:", tabsBlock);
      return;
    }

    // Move buttons into nav
    tabsBlock.querySelectorAll(".tabs-block__button > button").forEach((btn) => {
      nav.appendChild(btn);
    });

    // Move panes into tab-content
    tabsBlock.querySelectorAll(".tabs-block__pane > .tab-pane").forEach((pane) => {
      content.appendChild(pane);
    });

    const tabButtons = nav.querySelectorAll(".nav-link");
    const tabPanes = content.querySelectorAll(".tab-pane");

    // Find tab with data-active="true"
    let activeIndex = Array.from(tabButtons).findIndex(btn => btn.dataset.active === 'true');

    // Fallback: last tab if none is active
    if (activeIndex === -1) {
      activeIndex = tabButtons.length - 1;
    }

    if (tabButtons.length > 0 && tabPanes.length > 0) {
      const activeBtn = tabButtons[activeIndex];
      const activePane = tabPanes[activeIndex];

      tabButtons.forEach((btn, i) => {
        btn.classList.toggle('active', i === activeIndex);
        btn.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
        if (i === activeIndex) {
          btn.removeAttribute('tabindex');
        } else {
          btn.setAttribute('tabindex', '-1');
        }
      });

      tabPanes.forEach((pane, i) => {
        pane.classList.toggle('active', i === activeIndex);
        pane.classList.toggle('show', i === activeIndex);
      });
    }

    // Clean up wrappers
    tabsBlock.querySelectorAll(".tabs-block__button, .tabs-block__pane").forEach((el) => el.remove());
  });
});
