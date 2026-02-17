
const iframeScript = `
<script>
  let selectedElement = null;
  let hoverElement = null;

  // Add styles for selection and hover
  const style = document.createElement('style');
  style.textContent = '.webcraft-hover { outline: 2px dashed #6366f1 !important; outline-offset: -2px !important; cursor: pointer !important; } .webcraft-selected { outline: 2px solid #6366f1 !important; outline-offset: -2px !important; }';
  document.head.appendChild(style);

  function getElementData(el) {
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

  document.addEventListener('mouseover', (e) => {
    if (e.target === document.body || e.target === document.documentElement) return;
    if (hoverElement) hoverElement.classList.remove('webcraft-hover');
    hoverElement = e.target;
    hoverElement.classList.add('webcraft-hover');
  });

  document.addEventListener('mouseout', (e) => {
    if (hoverElement) {
      hoverElement.classList.remove('webcraft-hover');
      hoverElement = null;
    }
  });

  document.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedElement) selectedElement.classList.remove('webcraft-selected');
    selectedElement = e.target;
    selectedElement.classList.add('webcraft-selected');

    window.parent.postMessage({
      type: 'ELEMENT_SELECTED',
      payload: getElementData(selectedElement)
    }, '*');
  });

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
      // Remove our utility classes before sending HTML
      const tempSelected = selectedElement;
      if (selectedElement) selectedElement.classList.remove('webcraft-selected');
      window.parent.postMessage({ type: 'html', html: document.documentElement.outerHTML }, '*');
      if (tempSelected) tempSelected.classList.add('webcraft-selected');
    }
  });

  // Intercept console logs to send to parent
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    window.parent.postMessage({ type: 'log', args }, '*');
    originalConsoleLog.apply(console, args);
  };

  // Intercept errors to send to parent
  window.onerror = (message, source, lineno, colno, error) => {
    window.parent.postMessage({ type: 'error', message, source, lineno, colno, error }, '*');
  };
</script>
`;

export default iframeScript;
