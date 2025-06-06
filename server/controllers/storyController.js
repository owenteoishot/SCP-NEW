const storyModel = require('../models/storyModel');
const chapterModel = require('../models/chapterModel');

exports.getStories = async (req, res) => {
  try {
    const stories = await storyModel.getAllStories();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stories' });
  }
};

exports.getStory = async (req, res) => {
  try {
    const story = await storyModel.getStoryById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch story' });
  }
};

exports.getChapters = async (req, res) => {
  try {
    const chapters = await chapterModel.getChaptersByStory(req.params.id);
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chapters' });
  }
};

exports.getChapter = async (req, res) => {
  try {
    const chapter = await chapterModel.getChapter(req.params.id, req.params.chapterNumber);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chapter' });
  }
};