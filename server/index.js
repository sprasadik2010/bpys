
// var express = require('express');
var cors = require('cors');
// var app = express();
const open = require('open');
const fs = require('fs');
const config = require('../config.json');
// const port = 2020;
// //app.use(cors());
// app.get('/', (req, res) => {
//     res.write(`BPYS APIs`)
// });
// app.get('/getallpdf/$fpath', (req, res) => {
//     fs.readdirSync(fpath).forEach(file => {
//         console.log(file);
//       });
// });

// app.listen(port, () => console.log(`BPYS app listening on port ${port}!`));


const express = require('express')
const app = express();

//const port = 2010;
const port = 2020;
app.use(cors());

app.get('/getfiles', async(req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var files = getfiles(config.searchpath);
  const targetFiles = files.filter(file => {
        return file.replace(/^.*[\\\/]/, '').includes(req.query.filter.toLowerCase());
      });
      res.end(JSON.stringify(targetFiles));
    });

app.get('/', async(req, res) => {
  const searchpath = config.searchpath;  
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.send(`
  <script>
  function savePath(newval){
    var http = new XMLHttpRequest();
    var url = 'http://localhost:` + port + `/updatesearchpath?pathtext='+newval;
    http.open('POST', url, true);
    // http.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
    // http.setRequestHeader('Access-Control-Allow-Origin', '*');
    //Send the proper header information along with the request
    //http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send();





    // config.searchpath = newval;
    // var fs = require('fs');
    // fs.writeFile("thing.json", JSON.stringify(config));
  }
  
  </script>
  BPYS API Server Is Up ...<br/>

  <input 
  id = "ipSearchpath"
  type="Text"
  value="` +  searchpath + `"
  />
  <button id='ipFolder' onClick='savePath(document.getElementById("ipSearchpath").value)'>Save</button>
  `);
});
app.get('/downloadfile', async(req, res) => {
  res.setHeader('Content-Type', 'application/json');
      open(req.query.filename);
});



app.get('/', async(req, res) => {
  res.end(`BPYS API Server Is Up ...`);
});


app.post('/updatesearchpath', async(req, res) => {
  config.searchpath = req.query.pathtext;
  await fs.writeFileSync('../config.json', JSON.stringify(config));
  res.status=200;
});
app.get('/test', async(req, res) => {
  res.end(`BPYS Test Succeeded... Please Go Ahead`);
});


const getfiles = function(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
      file = dir + '/' + file;
      file_type = file.split(".").pop();
      file_name = file.split(/(\\|\/)/g).pop();
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) { 
          results = results.concat(getfiles(file));
      } else { 
          //if (file_type == "js") 
          results.push(file);
      }
  });
  return results;
}


app.listen(port, () => {
  console.log(`BPYS API Server listening on port ${port}`)
})
