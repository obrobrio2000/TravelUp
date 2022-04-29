CREATE TABLE contributors
(
    id SERIAL,
    name text,
    title text,
    CONSTRAINT contributors_pkey PRIMARY KEY (id)
);

INSERT INTO contributors(name, title) VALUES
 ('Stefano Mazziotta', 'Co-Founder'),
 ('Filippo Serafini', 'Co-Founder'),
 ('Giovanni Magliocchetti', 'Co-Founder');
