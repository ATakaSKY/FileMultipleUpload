const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const User = require('./model/User');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://sky:sky1234@cluster0-ftnod.mongodb.net/fileUploadTestDB?retryWrites=true&w=majority`,{ useNewUrlParser: true })
    .then(res => console.log('conncdtion established'))
    .catch(res => console.log('error in connectinng to mongo'));

app.use(cors());

app.use(bodyParser.json());
app.use('/images',express.static(path.join(__dirname, 'public')));

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'public')
},
filename: function (req, file, cb) {
  cb(null, Date.now() + '-' +file.originalname )
}
})

let upload = multer({ storage: storage }).array('file')

app.post('/api/upload', async function(req,res) {
  console.log(req.body)
  upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
          return res.status(500).json(err)
      } else if (err) {
          return res.status(500).json(err)
      }
  
  const serverUrl = `${req.protocol}://${req.get('host')}/`;
  
  let filesArr = [];
  for(let imgName of req.files){
    filesArr.push(serverUrl + 'images/' + imgName.filename);
  }
  const user = new User({
    name:req.body.name,
    files:filesArr
  })
  const newUser = await user.save();
  return res.status(200).json({user:newUser, message: 'User info saved sucessfully'})

})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT); 
}); 