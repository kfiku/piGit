declare var FuseBox: any;
declare var process: any;

const customizedHMRPlugin = {
  hmrUpdate: ({ type, path, content }) => {
    // if (type === 'js' && path.indexOf('components/') > -1) {
    //   console.log('dynamic hrm');
    //   FuseBox.flush(file => {
    //     if (/store/.test(file)) {
    //       return false;
    //     }
    //     return true;
    //   });
    //   FuseBox.dynamic(path, content);
    //   if (FuseBox.mainFile) {
    //     FuseBox.import(FuseBox.mainFile);
    //   }
    //   return true;
    // } else {
    console.log('static htm');
    location.reload();
    // }
  }
};

let alreadyRegistered = false;
if (!process.env.hmrRegistered) {
  process.env.hmrRegistered = false;
  FuseBox.addPlugin(customizedHMRPlugin);
}
