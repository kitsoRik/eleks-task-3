export const host = "http://localhost:11003";

export async function getAllSingers(params) {
     const res = await _sendWithParams(`${host}/singers`, params);
     const body = res.json();
     
     return body;
}

export async function getSingerById(id) {
     const res = await _sendWithParams(`${host}/singers/${id}`);
     const body = res.json();
     
     return body;
}

export async function getPagesCount(limit) {
     const res = await _sendWithParams(`${host}/singers/pagesCount`, { limit });
     const body = res.json();
     
     return body;
}

function _sendWithParams(furl, params) {
     if(params) Object.keys(params)
          .forEach(key => { if(!params[key]) delete params[key] });

     let url = new URL(furl);
     url.search = new URLSearchParams(params).toString();
     return fetch(url);
}