-- ALTER TABLE user MODIFY salt TEXT NOT NULL;
-- ALTER TABLE user ADD COLUMN auth_token TEXT;
CREATE TABLE likes (
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user (id),
  FOREIGN KEY (post_id) REFERENCES post (id)
)