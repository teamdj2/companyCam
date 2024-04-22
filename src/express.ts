import express = require('express');
import bodyParser = require('body-parser');
import http = require('http');
import { postExistingToCompanyCamIfNotExists } from './pushexisting' ;
import { sendLogToSlack } from './exceptionHandler';
//remove before adding to git
//var dotenv = require('dotenv').config({ path: require('find-config')('.env') })
//dotenv.config({override: true})
var app = express();

app.use(bodyParser.json());

let savedData = null; 

app.get('/', (req: any, res: any) => {
  res.status(200).send('Hello, this is the root path!');
});

let savedDataArray: any[] = [];
let counter = 0;
const requestArray: number[] = []
const detailsOfSent: [] = [];

app.post('/pushCurrent', async (req: any, res: express.Response) => {
  const id = Date.now();
  requestArray.push(id);
  counter++
  console.log("************** = " + counter);
  const interval = setInterval(async() => {
    if (requestArray[0] === id) {
     try {
       savedDataArray.push(req.body);
       await postExistingToCompanyCamIfNotExists([req.body]);
       await detailsOfSent.push()
     } catch (error) {
       console.error('Error:', error);
       res.status(500).send({ message: 'Internal Server Error' });
     }
      requestArray.shift();
      clearInterval(interval);
     }
   }, 2000);
   await Promise.resolve();
   res.send({ message: 'Data saved successfully' });
}); 

app.get('/data', (req: any, res: any) => {
  res.status(200).json(savedDataArray);
});

let testArray = [];
app.post("/test", (req: any, res: any) => {
  testArray.push(req.body);
  res.send({message: "Test route hit"});
});

app.get("/GetTest", (req: any, res: any) => {
  res.status(200).json(testArray)
});

app.get('/health', async(req: any, res: any) => {
  res.status(200).json("Healthy");
  await sendLogToSlack("Healthy");
});

app.get("/clearArray", (req: any, res: any) => {
    savedDataArray = [];
    testArray = [];
    res.status(200).json("Clearing array ...");
});
const httpsServer = http.createServer(app); //credentials, 

// const port = 4433;
const port = process.env.PORT

httpsServer.listen(port, async() => {
  console.log(`Server is running on port ${port}`);
  await sendLogToSlack("hello world");
});