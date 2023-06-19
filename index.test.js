const supertest = require('supertest')
const index = require('./index')

describe('GET /showCat' ,() => {
    describe('get cat', () => {
      test('ok', async () => {
        const res = await request(index).get('/showCat')
        expect(res.statusCode).toBe(200)
      })
    })
  
})