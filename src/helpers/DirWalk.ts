import { stat, readdir } from 'fs';
import { join, basename, resolve } from 'path';

const ignores = ['node_modules', 'bower_components', 'friendsofsymfony', 'sonata'];

const walk = (dir: string,
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
          stat(filepath, (err2, stat) => {
            if (stat && stat.isDirectory()) {
              walk(filepath, step, (err3, res) => {
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

export default walk;
