DROP DATABASE IF EXISTS progressionusers;
CREATE DATABASE progressionusers;

\c progressionusers;

CREATE TABLE progressionusers (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR (123) NOT NULL,
  password VARCHAR (123) NOT NULL,
  email VARCHAR (123) NOT NULL
);

CREATE TABLE ascents (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name VARCHAR (123) NOT NULL,
  location VARCHAR (123) NOT NULL,
  grade VARCHAR (123) NOT NULL,
  caption VARCHAR (123) NOT NULL
);

CREATE TABLE projects (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name VARCHAR (123) NOT NULL,
  location VARCHAR (123) NOT NULL,
  grade VARCHAR (123) NOT NULL,
  priority INTEGER NOT NULL,
  season VARCHAR (123) NOT NULL,
  moves_total INTEGER NOT NULL,
  moves_done INTEGER NOT NULL,
  high_point INTEGER NOT NULL,
  caption VARCHAR (123) NOT NULL
);

CREATE TABLE workouts (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  date VARCHAR (123) NOT NULL,
  type VARCHAR (123) NOT NULL,
  description VARCHAR (123) NOT NULL
);

CREATE UNIQUE INDEX email ON progressionusers (email);