const { join } = require('path');
const { app } = require('electron');

export default function getIcon() {
  return join(app.getAppPath(), 'resources', 'icon.png');
}
