const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

////////////////////////////////// All Article ////////////////////////////

app.route("/articles")
  .get(function(req, res) {
    Article.find(async function(err, foundArticles) {
      if (!err) {
        await res.send(foundArticles);
      } else {
        await res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const articleTitle = req.body.title;
    const articleContent = req.body.content;

    const newArticel = new Article({
      title: articleTitle,
      content: articleContent
    });
    newArticel.save(function(err) {
      if (!err) {
        res.send("Successfully added to the DB");
      } else {
        res.send(err)
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Succsessfully deleted all Articles");
      } else {
        res.send(err);
      }
    });
  });

////////////////////////////////// Specific Article ////////////////////////////

app.route("/articles/:articleTitle")
  .get(function(req, res) {
    const articleTitle = req.params.articleTitle;
    Article.findOne({
      title: articleTitle
    }, function(err, foundAtricle) {
      if (foundAtricle) {
        res.send(foundAtricle);
      } else {
        res.send("No Articles with that title was found!");
      }
    });
  })
  .put(function(req, res) {
    const articleTitle = req.params.articleTitle;
    Article.update({
        title: articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated " + articleTitle + " article");
        } else {
          res.send("There's an error with updating " + articleTitle + "article: " + err);
        }
      }
    );
  })
  .patch(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated the article");
        } else {
          res.send("There's an error with updating the article: " + err);
        }
      }
    );
  })
  .delete(function(req, res) {
    Article.deleteOne({
        title: req.params.articleTitle
      },
      function(err) {
        if (!err) {
          res.send("The " + req.params.articleTitle + " article removed Succsessfully");
        } else {
          res.send("error with removing the article: " + err);
        }
      });
  });





app.listen(3000, function() {
  console.log("Server is running...");
})
