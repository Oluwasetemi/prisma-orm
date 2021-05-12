-- -------------------------------------------------------------
-- TablePlus 3.12.8(368)
--
-- https://tableplus.com/
--
-- Database: starter.db
-- Generation Time: 2021-05-11 21:37:02.0640
-- -------------------------------------------------------------


CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT
);

INSERT INTO "User" ("id", "email", "name") VALUES
('1', 'setemi@mailinator.com', 'stephen'),
('2', 'stephen@mailinator.com', 'temi'),
('4', 'ope@mailinator.com', 'ope'),
('5', 'opeyemi@mailinator.com', 'opeyemi');
