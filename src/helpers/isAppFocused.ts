let focused = true;
window.onblur =  () => focused = false;
window.onfocus = () => focused = true;

const isAppFocused = () => focused;

export default isAppFocused;
