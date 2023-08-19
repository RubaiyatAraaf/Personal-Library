/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

module.exports = function (app, Books) {
  app
    .route("/api/books")
    .get(function (req, res) {
      Books.find((err, docs) => {
        if (err) return console.log(err);
        const response = [];
        docs.map((v) => {
          response.push({
            _id: v._id,
            title: v.title,
            commentcount: v.comments.length,
          });
        });
        res.json(response);
      });
    })

    .post(function (req, res) {
      let title = req.body.title;

      if (!title) {
        return res.json("missing required field title");
      }
      Books.create({ title: title }, (err, doc) => {
        if (err) return console.log(err);
        res.json({ title: doc.title, _id: doc._id });
      });
    })

    .delete(function (req, res) {
      Books.deleteMany((err) => {
        if (err) return console.log(err);
        res.json("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      if (!bookid) {
        return res.json("missing required field id");
      }
      Books.findById(bookid, (err, doc) => {
        if (!doc) return res.json("no book exists");
        res.json(doc);
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!bookid) {
        return res.json("missing required field id");
      }
      if (!comment) {
        return res.json("missing required field comment");
      }
      Books.findByIdAndUpdate(
        bookid,
        {
          $push: {
            comments: comment,
          },
        },
        { new: true },
        (err, doc) => {
          if (!doc) return res.json("no book exists");
          res.json(doc);
        }
      );
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      if (!bookid) {
        return res.json("no book exists");
      }
      Books.findByIdAndDelete(bookid, (err, doc) => {
        if (!doc) return res.json("no book exists");
        res.json("delete successful");
      });
    });
};
