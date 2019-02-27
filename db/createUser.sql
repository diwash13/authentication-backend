insert into users (name, email, password)
values (${name}, ${email}, ${hash})
returning name, email, id;