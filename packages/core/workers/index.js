// Node 8 supports native async functions - no need to use compiled code!
// module.exports =
//   parseInt(process.versions.node, 10) < 8
//     ? require('./lib/WorkerFarm')
//     : require('./src/WorkerFarm');

function getIndex() {
  try {
    if (parseInt(process.versions.node, 10) < 8) {
      return require('./lib/WorkerFarm');
    } else {
      return require('./src/WorkerFarm');
    }
  } catch (e) {
    return require('./src/WorkerFarm');
  }
}

module.exports = getIndex();
