USE chat;

CREATE TABLE messages (
  messageid INT NOT NULL AUTO_INCREMENT,
  text VARCHAR(200) NOT NULL,
  createdAt DATE,
  username VARCHAR(15) NOT NULL,
  roomname VARCHAR(30) NOT NULL,
  PRIMARY KEY (messageid)
);

CREATE TABLE users (
  username VARCHAR(30) NOT NULL,
  userid INT NOT NULL AUTO_INCREMENT,
  password VARCHAR(10),
  PRIMARY KEY (userid)
);

CREATE TABLE rooms (
  roomname VARCHAR(30) NOT NULL
);

CREATE TABLE userfriends (
  userid INT NOT NULL,
  friendid INT NOT NULL
);


/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/
