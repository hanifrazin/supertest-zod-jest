const supertest = require('supertest');
const baseUrl = 'https://restful-booker.herokuapp.com'; // Ganti dengan URL target kamu

function requestWithDefaults(method,endpoint,data = null,token = null, queryParams = null) {
    if (queryParams && typeof queryParams === 'object') {
        const queryString = Object.entries(queryParams)
                                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                                    .join('&');
        
        endpoint += `?${queryString}`;
    }
    
    let req = supertest(baseUrl)[method](endpoint)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

    if(token){
        req = req.set('Authorization',`Basic YWRtaW46cGFzc3dvcmQxMjM=`)   
    }

    if(data){
        req = req.send(data);
    }

    return req;
}

module.exports = requestWithDefaults;
