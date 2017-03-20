var path = require('path');
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/themer',
      deployTo: '/opt/pengu/themer',
      repositoryUrl: 'https://github.com/penguinstampede/structure-themer.git',
      keepReleases: 2,
      ignores: ['.git','config','test','node_modules','bower_components'],
      deleteOnRollback: false,
      key: 'config/deploy_id_rsa',
      shallowClone: true
    },
    master: {
      servers: 'pinguino@themer.penguinstampede.com'
    }
  });

  shipit.on('updated', function () {
    shipit.remote('npm install', {cwd: shipit.releasePath}).then(function (res) {
      shipit.remote('bower install --force', {cwd: shipit.releasePath});
    });
  });
};
