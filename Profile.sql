-- -------------------------------------------------------------
-- TablePlus 3.12.8(368)
--
-- https://tableplus.com/
--
-- Database: starter.db
-- Generation Time: 2021-05-11 21:41:33.1860
-- -------------------------------------------------------------


CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bio" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "Profile" ("id", "bio", "userId") VALUES
('1', 'Hello World', '1'),
('2', 'some profile bio from postman', '2'),
('3', 'some profile bio from prisma', '4');
