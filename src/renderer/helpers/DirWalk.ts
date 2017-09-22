import { stat, readdir } from 'fs';
import { exec } from 'child_process';
import { basename, resolve } from 'path';

const ignores = ['node_modules', 'bower_components', 'friendsofsymfony', 'sonata', 'symfony'];
let isTree; // = false; // FORCE NODE IMPLEMENTATION

const checkIsTreeCommand = (callback) => {
  if (isTree === undefined) {
    exec('which tree', (err) => {
      isTree = !err;
      callback(isTree);
    });
  } else {
    callback(isTree);
  }
};

const treeWalk = (dir: string,
                  step: (dir: string) => void,
                  done: (err: any, dirs?: string[]) => void,
                  name: string = undefined,
                  depth = 5) => {
  let results = [];

  const addResult = (filename, filepath) => {
    if (!name || filename === name ) {
      step(filepath);
      results.push(filepath);
    }
  };

  let fulldir = resolve(dir);
  let include = name ? '-P "' + name + '"' : '';
  let exclude = '-I "' + ignores.join('|') + '"';
  let grep = name ? ' | grep -E "' + name + '$"' : '';

  exec(`tree ${fulldir} -d -a -f -L ${depth} ${include} ${exclude} ${grep}`, (err, files) => {
    if (err) {
      return done(err);
    }

    let filesArr = files.split('\n');
    filesArr.map((f) => {
      let filepath = f.split(' /')[1] && '/' + f.split(' /')[1];
      if (filepath) {
        addResult(basename(filepath), filepath);
      }
    });

    done(null, results);
  });
};


const nodeWalk = (dir: string,
                  step: (dir: string) => void,
                  done: (err: any, dirs?: string[]) => void,
                  name: string = undefined,
                  depth = 5) => {
  let results = [];
  let pending;

  const addResult = (filename, filepath) => {
    if (!name || filename === name ) {
      step(filepath);
      results.push(filepath);
    }
  };

  // USE NODE IMPLEMENTATION
  readdir(dir, function(err, list) {
    if (err) {
      return done(err);
    }

    pending = list.length;

    if (!pending) {
      return done(null, results);
    }

    list.forEach((filename) => {
      let filepath = resolve(dir, filename);

      if (ignores.indexOf(filename) > -1) {
        if (!--pending) {
          done(null, results);
        }
      } else {
        addResult(filename, filepath);

        if (depth === 0) {
          if (!--pending) {
            done(null, results);
          }
        } else {
          stat(filepath, (err2, st) => {
            if (!err2 && st && st.isDirectory()) {
              nodeWalk(filepath, step, (err3, res) => {
                if (err3) { console.log(err3); }
                results = results.concat(res);
                if (!--pending) {
                  done(null, results);
                }
              }, name, depth - 1);
            } else {
              // console.log(filename, name);
              addResult(filename, filepath);

              if (!--pending) {
                done(null, results);
              }
            }
          });
        }
      }
    });
  });
};

const walk = (dir: string,
              step: (dir: string) => void,
              done: (err: any, dirs?: string[]) => void,
              name: string = undefined,
              depth = 5) => {

  checkIsTreeCommand((exists) => {
    if (exists) {
      treeWalk(dir, step, done, name, depth);
    } else {
      nodeWalk(dir, step, done, name, depth);
    }
  });
};

export default walk;
