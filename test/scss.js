//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../themer');
var should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Routes', () => {
  /*
  * Test the /GET route
  */
  describe('/GET home', () => {
      it('it should reply with "Good job! You are here!"', (done) => {
        chai.request(server)
            .get('/v1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.message.should.equal('Good job! You are here!');
              done();
            });
      });
  });

});
