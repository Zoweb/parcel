// Node 8 supports native async functions - no need to use compiled code!
// module.exports =
//   parseInt(process.versions.node, 10) < 8
//     ? require('./lib/Logger')
//     : require('./src/Logger');

function getIndex() {
  try {
    if (parseInt(process.versions.node, 10) < 8) {
      return require('./lib/Logger');
    } else {
      return require('./src/Logger');
    }
  } catch (e) {
    return require('./src/Logger');
  }
}

module.exports = getIndex();
