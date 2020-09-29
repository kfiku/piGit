import { join } from 'path';
import { remote } from 'electron';

const { app } = remote;

export default function getIcon() {
  return join(app.getAppPath(), 'resources', 'icon.png');
}
