const db = require('./db');

exports.getChaptersByStory = async (storyId) => {
  const result = await db.query(
    'SELECT * FROM chapters WHERE story_id = $1 ORDER BY chapter_number ASC',
    [storyId]
  );
  return result.rows;
};

exports.getChapter = async (storyId, chapterNumber) => {
  const result = await db.query(
    'SELECT * FROM chapters WHERE story_id = $1 AND chapter_number = $2',
    [storyId, chapterNumber]
  );
  return result.rows[0];
};