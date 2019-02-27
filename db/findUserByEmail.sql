select id, name, email, password
from users
where email = $1;