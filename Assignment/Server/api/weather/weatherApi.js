var express = require('express');
var router = express.Router();
var weather = require('../../model/weatherModel');

router.get('/weathers',function(req,res){
  weather.find({},function(err,d){
    res.send(d);
  });
});

router.post("/add",function(req,res){
  var data=new weather(req.body);
  JSON.stringify(data);
  data.save(function(err,d){
    if(d)
    res.send(d);
    else {
      res.send(err);
    }
  });
});

router.put("/refresh/:name",function(req,res){
  weather.update({name:req.params.name},req.body,function(){
    res.send(req.params.name);
  });
});

module.exports=router;
