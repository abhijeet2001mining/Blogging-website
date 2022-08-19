//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Starting a journal for the first time can be intimidating, with all the blank pages stretching out in front of you waiting to be filled. Some people will find it easier to commit if they go out and purchase a designated special book to write in, while others might find that increases the intimidation factor.In fact, your journal doesn’t even have to be a book or notebook at all. The positive results were consistent for people who typed their journals or used a voice recorder to put their experiences into words. Experiment with different methods to see what feels best to you, since there’s no one right or wrong way to journal.";
const aboutContent = "The more honest you can be in your journaling, the better it will serve you. Be curious and explore whatever ideas come to mind, without worrying about grammar or penmanship. Writing about emotions and deep feelings will be more beneficial than just recording the weather or how many reps you completed at the gym.By doing so, you may find that how you’re feeling for the day may be connected to your current physical health, too. For example, maybe you didn’t eat enough carbs before a marathon and now you feel completely drained. A journal will help you monitor those connections.";
const contactContent = "There’s no one answer for everyone about what time of day is most effective for journaling. Some people prefer to do it in the evening to wrap up and reflect on the day’s events. For others, writing a journal first thing in the morning helps them to focus and prepare for the day. It can also be a nice way to shift gears during a lunch or mid-afternoon break. Really whenever you have your journal and a bit of quiet time is the right time for journaling.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
