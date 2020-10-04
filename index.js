var express         =  require('express');
var mongoose        =  require('mongoose');
var bodyParser      =  require('body-parser');
var articleModel    =  require('./model/comment');

mongoose.connect('mongodb://localhost:27017/cmnt',{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log('connection err',err))

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/articles',async (req,res)=>{
  try {
      var response = await articleModel.find();
          res.json(response);
  } catch (error) {
      console.log(error);
  }
});

app.post('/addArticle',async (req,res)=>{
    try {
        var article =  new articleModel({
            article:req.body.article
        });
        var response = await article.save();
        res.json(response);
    } catch (error) {
        console.log(error);
    }
});

app.post('/addComment',async (req,res)=>{
    try {
        var comments = {
            comment:req.body.comment
        }
        var response  =  await articleModel.update({'_id':req.body.id},{$push:{'comment':comments}});
        res.json(response);
    } catch (error) {
        console.log(error);     
    }
});

app.post('/editComment',async (req,res)=>{
 try {
     var response = await articleModel.find({'_id':req.body.id},{'comment':{$elemMatch:{'_id':req.body.cid}}});
     res.json(response);
 } catch (error) {
     console.log(error);
 }
});

app.post('/updateComment',async (req,res)=>{
  try {
      var cmnt = {
          name:req.body.name
      }
      var response = await articleModel.update({'_id':req.body.id,'comment._id':req.body.cid},{$set:{'comment.$.comment':req.body.comment}});
      res.json(response);
  } catch (error) {
      console.log(error);
  }
});

app.post('/deleteComment',async (req,res)=>{
   try{
      var response = await articleModel.update({'_id':req.body.id},{$pull:{'comment':{_id:req.body.cid}}});
      res.json(response);
   }catch(error){
     console.log(error);
   }
});

var port  = process.env.PORT || 3000;
app.listen(port,()=>console.log(`server run at port ${port}`));