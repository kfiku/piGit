import { stat, readdir } from 'fs';
import { join, basename, resolve } from 'path';

const ignores = ['node_modules', 'bower_components', 'friendsofsymfony', 'sonata'];

const walk = function(dir: string, done, name = undefined, depth = 5) {
  let results = [];
  readdir(dir, function(err, list) {
    if (err) {
      return done(err);
    }

    let pending = list.length;
    if (!pending) {
      return done(null, results);
    }

    list.forEach((filename) => {
      let file = resolve(dir, filename);

      if (ignores.indexOf(filename) > -1) {
        console.log('IGNORE', filename);
        if (!--pending) {
          done(null, results);
        }
      } else {
        if (filename === name ) {
          results.push(file);
        }

        if (depth === 0) {
          if (!--pending) {
            done(null, results);
          }
        } else {
          stat(file, (err2, stat) => {
            if (stat && stat.isDirectory()) {
              walk(file, function(err3, res) {
                results = results.concat(res);
                if (!--pending) {
                  done(null, results);
                }
              }, name, depth - 1);
            } else {
              // console.log(filename, name);
              if (!name || filename === name ) {
                results.push(file);
              }
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
