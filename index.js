const express = require('express');
const redis = require('redis');

const PORT = process.env.PORT || 8000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.post('/createroom', (req,res) => {

    let id = req.body.id;
    client.llen(id,(err,reply) => {
        if(reply > 0)
            res.status(409).send("Room Exists Already");
        else{
            client.rpush(id,"Beginning of Chat Room",(err,reply) => {
                if(reply != null){
                    res.sendStatus(200);
                }
                else
                    res.status(400).send(err);
            });
        }
    })
    

});

app.put('/chat', (req,res) =>{

    let id = req.body.id;
    let chat = req.body.chat;

    client.rpush(id,chat,(err,reply) => {
        client.llen(id,(err,reply) => {
            if(reply > 10)
                client.ltrim(id,1,-1, () => {});
        });
        if(reply > 0){
            res.sendStatus(200)
        }
        else{
            res.sendStatus(400);
        }
    })

});

app.get('/get/:id', (req,res) => {

    client.lrange(req.params.id,0,-1,(err, reply) => {
        if(reply == null)
            res.sendStatus(404);
        else
            res.status(200).send(reply);});
    

});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});