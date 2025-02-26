CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('Mr John Doe', 'https://johndoe.com', 'John - the traveller', 20);
insert into blogs (author, url, title, likes) values ('Mrs Jane Doe', 'https://janedoe.com', 'Jane - the explorer', 50);