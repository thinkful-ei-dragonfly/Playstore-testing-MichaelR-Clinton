'use strict';

const expect = require('chai').expect;
const supertest = require('supertest');

const app = require('../app');

describe('app', () => {
  it('should return a list of apps',() => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .then(res => {
        console.log('RES.body');
        console.log(res.body);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(20);
      });
  });

});