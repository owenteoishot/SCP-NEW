const postModel = require('../models/postModel');

exports.getPosts = async (req, res) => {
  const { userId } = req.query;
  if (userId && !/^[0-9a-fA-F-]{36}$/.test(userId)) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  const posts = userId
    ? await postModel.getPostsByUser(userId)
    : await postModel.getAllPosts();
  res.json(posts);
  console.error('Error fetching posts:', err);
  res.status(500).json({ message: 'Failed to load posts' });
};
exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content || title.length > 100 || content.length > 1000) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  const userId = req.user.userId;
  const newPost = await postModel.createPost(userId, title, content);
  res.status(201).json(newPost);
  console.error('Error creating post:', err);
  res.status(500).json({ message: 'Failed to create post' });
};