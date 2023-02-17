const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const path = require('path');

const bodyParser = require('body-parser')
const upload = multer({ dest: 'uploads/' })

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// extra
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(express.static(__dirname))



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwbwt8c.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postsCollection = client.db('socialCon').collection('posts');

        app.post('/posts', upload.array("image", 12), async (req, res) => {
            console.log(req.body, "files: ",req.files);
            const postMessage = req.body.postMessage;
            let imageUrl = [];
            for (const element of req.files){
                imageUrl.push(element.path) ;
            }
            const posts = {
                postMessage: postMessage,
                imageUrl: imageUrl,
                like:'',
                comment: ''
            }
            const result = await postsCollection.insertOne(posts);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('SocialCon server is running');
})

app.listen(port, () => console.log(`SocialCon server is running on ${port}`))