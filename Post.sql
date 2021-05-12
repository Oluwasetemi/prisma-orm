-- -------------------------------------------------------------
-- TablePlus 3.12.8(368)
--
-- https://tableplus.com/
--
-- Database: starter.db
-- Generation Time: 2021-05-11 21:41:21.2160
-- -------------------------------------------------------------

CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" INTEGER NOT NULL,
    FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "Post" ("id", "createdAt", "updatedAt", "title", "content", "published", "viewCount", "authorId") VALUES
('1', '2021-05-11 15:00:29', '2021-05-11 15:00:29', 'first blog post', 'abcdefghijklmnopqrstuvwxyz', '1', '0', '1'),
('2', '2021-05-11 15:00:29', '1620748803169', 'second blog post ', '1234567890', '1', '4', '1'),
('4', '2021-05-11 15:00:29', '2021-05-11 15:00:29', 'Fourth Post', 'also boop', '0', '0', '2'),
('5', '1620747259925', '1620747807501', 'some title from postman', 'anther content', '1', '0', '5'),
('6', '1620747259931', '1620747812664', 'some title from postman 2', 'anther content 2', '1', '0', '5'),
('7', '1620748925775', '1620748925776', 'some title from postman', 'anther content', '0', '0', '5'),
('8', '1620749087178', '1620749087179', 'some title from postman', 'anther content', '0', '0', '2');
