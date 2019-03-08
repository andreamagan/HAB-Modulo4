'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  owner: String,
  author: String,
  content: String,
  createdAt: Date,
  comments: [{
    author: String,
    comments: String,
    createdAt: Date
  }],
  likes: [String],
  deleteAt: Date,
});

const Post = mongoose.model('Post', postSchema)

module.exports = Post;
