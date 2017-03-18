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
          res.body.should.have.property('message');
          res.body.message.should.equal('Good job! You are here!');
        done();
      });
    });
  });

  describe('/POST scss', () => {
    it('it should load with defaults if there are no parameters', (done) => {
      chai.request(server)
        .post('/v1/scss')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('css');
            res.body.css.should.be.a('string');
            res.body.css.should.contain('a{line-height:inherit;color:#1779ba;');
          done();
        });
      });
      it('it should replace defaults if there are any parameters', (done) => {
        var settings = {
          primary_color: '#6f5499'
        }
        chai.request(server)
          .post('/v1/scss')
          .send(settings)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('css');
              res.body.css.should.be.a('string');
              res.body.css.should.contain('a{line-height:inherit;color:#6f5499;');
            done();
          });
        });
    });

});
