
const iframeScript = `
<script id="ai-preview-script">
  (function() {
    let selectedElement = null;
    let hoverElement = null;

    // Add styles for selection and hover
    const style = document.createElement('style');
    style.id = 'ai-preview-style';
    style.textContent = '.webcraft-hover { outline: 2px dashed #6366f1 !important; outline-offset: -2px !important; cursor: pointer !important; } .webcraft-selected { outline: 2px solid #6366f1 !important; outline-offset: -2px !important; }';
    document.head.appendChild(style);

    function getElementData(el) {
      if (!el) return null;
      const styles = window.getComputedStyle(el);
      return {
        tagName: el.tagName,
        className: el.className,
        text: el.innerText,
        styles: {
          padding: styles.padding,
          margin: styles.margin,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontSize: styles.fontSize,
        }
      };
    }

    // Use capture phase (true) to intercept events before they reach element-level listeners
    document.addEventListener('mouseover', (e) => {
      if (e.target === document.body || e.target === document.documentElement) return;
      if (hoverElement) hoverElement.classList.remove('webcraft-hover');
      hoverElement = e.target;
      hoverElement.classList.add('webcraft-hover');
    }, true);

    document.addEventListener('mouseout', (e) => {
      if (hoverElement) {
        hoverElement.classList.remove('webcraft-hover');
        hoverElement = null;
      }
    }, true);

    document.addEventListener('click', (e) => {
      const target = e.target;
      const isNavigationElement = target.closest('a, button, [role="button"]');

      if (isNavigationElement) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (selectedElement) selectedElement.classList.remove('webcraft-selected');
      selectedElement = target;
      selectedElement.classList.add('webcraft-selected');

      window.parent.postMessage({
        type: 'ELEMENT_SELECTED',
        payload: getElementData(selectedElement)
      }, '*');
    }, true);

    document.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, true);

    // Block navigation via window.onbeforeunload
    window.onbeforeunload = function() {
      console.warn("Navigation blocked in preview mode.");
      return "Navigation is disabled in preview mode.";
    };

    window.addEventListener('message', (event) => {
      if (event.data.type === 'UPDATE_ELEMENT' && selectedElement) {
        const { text, className, styles } = event.data.payload;
        if (text !== undefined) selectedElement.innerText = text;
        if (className !== undefined) selectedElement.className = className + ' webcraft-selected';
        if (styles) {
          Object.assign(selectedElement.style, styles);
        }
      } else if (event.data.type === 'CLEAR_SELECTION_REQUEST') {
        if (selectedElement) {
          selectedElement.classList.remove('webcraft-selected');
          selectedElement = null;
        }
      } else if (event.data.type === 'get-html') {
        const tempSelected = selectedElement;
        if (selectedElement) selectedElement.classList.remove('webcraft-selected');
        window.parent.postMessage({ type: 'html', html: document.documentElement.outerHTML }, '*');
        if (tempSelected) tempSelected.classList.add('webcraft-selected');
      }
    });

    // Intercept console logs
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      window.parent.postMessage({ type: 'log', args }, '*');
      originalConsoleLog.apply(console, args);
    };

    window.onerror = (message, source, lineno, colno, error) => {
      window.parent.postMessage({ type: 'error', message, source, lineno, colno, error }, '*');
    };
  })();
</script>
`;

export default iframeScript;
