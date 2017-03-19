var path = require('path');
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/themer',
      deployTo: '/opt/pengu/themer',
      repositoryUrl: 'https://github.com/penguinstampede/structure-themer.git',
      ignores: ['.git','config','test'],
      keepReleases: 2,
      deleteOnRollback: false,
      key: 'config/deploy_id_rsa',
      shallowClone: true
    },
    master: {
      servers: 'pinguino@themer.penguinstampede.com'
    }
  });
};
