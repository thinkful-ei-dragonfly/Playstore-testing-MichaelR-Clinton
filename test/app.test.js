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

  it('should be 400 if sort is incorrect', () => {
    return supertest(app)
    .get('/apps')
    .query({sort: 'MISTAKE'})
      .expect(400, 'invalid sort category, please enter rating or app');
  });

  it('should sort by rating', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .query({sort: 'rating'})
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating <= res.body[i + 1].Rating;
          i++
        }
        expect(sorted).to.be.true;
      })
  });

  it('should sort by title', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .query({sort: 'app'})
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while (sorted && i < res.body.length - 1){
          sorted = sorted && res.body[i].App <= res.body[i + 1].App;
          i++
        }
        expect(sorted).to.be.true;
      })
  })

  it('should filter by genre', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .query({genres: 'Arcade'})
      .then(res => {
        expect(res.body).to.be.an('array');
        let filtered = true;
        for(let i = 0; i < res.body.length; i++){
          if (!res.body[i].Genres.includes('Arcade')){
            console.log(res.body[i].Genres);
            filtered = false;
          }
        }
        expect(filtered).to.be.true;
      })
  });

  it('should sort by rating/app and genre', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .query({genres: 'Arcade', sort: 'rating'})
      .then(res => {
        let i = 0;
        let sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].App <= res.body[i + 1].App;
          i++
        }
        expect(sorted).to.be.true;
        
        let filtered = true;
        for (let i = 0; i < res.body.length; i++) {
          if (!res.body[i].Genres.includes('Arcade')) {
            console.log(res.body[i].Genres);
            filtered = false;
          }
        }
        expect(filtered).to.be.true;
      })
  })
});