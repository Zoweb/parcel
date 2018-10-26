// Node 8 supports native async functions - no need to use compiled code!
// module.exports =
//   parseInt(process.versions.node, 10) < 8
//     ? require('./lib/Watcher')
//     : require('./src/Watcher');

function getIndex() {
  try {
    if (parseInt(process.versions.node, 10) < 8) {
      return require('./lib/Watcher');
    } else {
      return require('./src/Watcher');
    }
  } catch (e) {
    return require('./src/Watcher');
  }
}

module.exports = getIndex();
