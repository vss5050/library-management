const express = require('express');
const path = require('path')
const mysql = require('mysql2');

const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "library_management"
});



app.use(express.static('public'));
app.use(express.urlencoded());



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/book.html', (req, res) => {
  res.sendFile(path.join(__dirname + '/book.html'));
});

app.get('/borrow.html', (req, res) => {
  res.sendFile(path.join(__dirname + '/borrow.html'));
});

app.get('/member.html', (req, res) => {
  res.sendFile(path.join(__dirname + '/member.html'));
});


app.post('/book', (req, res) => {
  var sql = `INSERT INTO book (title, author, publisher, isbn, publication_year, category)
    values ('${req.body.title}','${req.body.author}','${req.body.publisher}','${req.body.isbn}',${req.body.publication_year},'${req.body.category}')`;

  con.connect(function (err) {
    if (err) throw err;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("connected");
    });
  });

  return res.sendFile(path.join(__dirname + '/index.html'));

});


app.post('/borrow', (req, res) => {
  var sql = `INSERT INTO borrow (memberid, copyid, borrow_date, due_date)
    values ('${req.body.memberid}','${req.body.copyid}','${req.body.borrow_date}','${req.body.due_date}')`;

  con.connect(function (err) {
    if (err) throw err;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("connected");
    });
  });

  return res.sendFile(path.join(__dirname + '/index.html'));

});

app.post('/member', (req, res) => {
  var sql = `INSERT INTO member (first_name, last_name, address, phone, email)
    values ('${req.body.first_name}','${req.body.last_name}','${req.body.address}','${req.body.phone}','${req.body.email}')`;

  con.connect(function (err) {
    if (err) throw err;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("connected");
    });
  });

  return res.sendFile(path.join(__dirname + '/index.html'));

});

app.post('/book_copy',(req,res) =>{
  var sql = `INSERT INTO book_copy (copyid, bookid, libraryid, statuss)
  values ('${req.body.copyid}','${req.body.bookid}','${req.body.libraryid}','${req.body.statuss}')`;

  con.connect(function (err) {
    if (err) throw err;
    con.query(sql, function (err,data) {
      if (err) throw err;
      console.log("connected");
      
    });
  });
  return res.sendFile(path.join(__dirname + '/index.html'));
});


app.post('/borrowed_books',(req,res) =>{
  var sql = `Select title, author,isbn, copyid, due_date  from borrow natural join book_copy natural join book where memberid=${req.body.memberid} and returned_date is NULL`;

  con.connect(function (err) {
    if (err) throw err;
    con.query(sql, function (err,data) {
      if (err) throw err;
      console.log("connected");
      return res.render('sample_data',{memberid:`${req.body.memberid}`,sampleData:data});
    });
  });
  
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
