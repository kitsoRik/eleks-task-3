const express = require("express");
const app = express();

const path = require("path");

const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database("./nice.db");

app.use(express.static("public"));

app.use("*", (req, res, next) => {

     res.setHeader("Access-Control-Allow-Origin", "*");

     next();
});

app.get("/singers", (req, res) => {
     _getSortedSingers(req.query, (singers) => {
          res.send(singers);
     })
});

app.get("/singers/pagesCount", (req, res) => {
     let { limit } = req.query;

     if(!limit) {
          res.send(1);
          return;
     }

     db.get("SELECT COUNT(id) FROM singers", (err, row) => {
          let count = row['COUNT(id)'] / limit;

          if(count !== parseInt(count)) count = parseInt(count) + 1;

          res.send({ pagesCount: count });
     });
})

app.get("/singers/:id", (req, res) => {
     
     const { id } = req.params;
     let singer = { };
     db.get("SELECT * FROM singers WHERE id=?", [ id ], (err, row) => {
          if(err) return console.log(err);
          
          singer.id = row.id;
          singer.name = row.name;
          singer.type = row.type;
          singer.year = row.year;
          singer.albums = []

          db.all("SELECT * FROM singers_albums WHERE singer_id=?", [id], (err, rows) => {
               if(rows.length == 0) {
                    res.send(singer);
                    return;
               }
               rows.forEach((album, index) => {
                    singer.albums.push(album); 

                    album.songs = [];

                    db.all("SELECT * FROM singers_songs WHERE singer_id=? AND album_id=?", 
                    [ id, album.id], (err, songs) => {
                         songs.forEach(song => {
                              album.songs.push(song);
                         });

                         if(index === rows.length - 1) {
                              res.send(singer);
                         }
                    });
               });
          });
     });
});

function _getSortedSingers(query, callback) {
     let { search, limit, sort, sortType = "ASC", page = 1 } = query;
     let singers = [];
     let querySingers = `select 
                              m.id as id,
                              m.name as name, 
                              m.year as year, 
                              count(s.id) as albumsCount
                         from singers m left join
                              singers_albums s
                              on m.id = s.singer_id
                         WHERE m.name LIKE ?
                         group by m.id, m.name
                         order by ${`${sort}`} ${sortType}
                         limit ${(page - 1) * limit},${limit}`;
     let queryParams = [
         `%${search ? search : ""}%`
     ];
     db.all(querySingers, queryParams, (err, singersRows) => {
          if(err) return console.log(err, querySingers);
          
          singers = singersRows;

          callback(singers);

          // let _index = 0;
          // singersRows.forEach((singer, singersIndex) => {
          //      db.get("SELECT COUNT(id) AS count FROM singers_albums WHERE singer_id=?", [singer.id], 
          //      (err, { count }) => {
          //           if(err) return console.log(err);

          //           singer.albumCount = count;
          //           singers.push(singer);

          //           if(++_index === singersRows.length)
          //      });
          // });
     });
} 

app.listen(11003, (err) => {
     if(err) return console.log(err);
     console.log("Listening 11003 port...");
});