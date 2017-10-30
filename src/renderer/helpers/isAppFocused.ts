let focused = true;
window.addEventListener('blur',  () => focused = false);
window.addEventListener('focus',  () => focused = true);

const isAppFocused = () => focused;

export default isAppFocused;
