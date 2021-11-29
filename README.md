# rma
a result management app

# install

### prerequisites

1. a mysql instance running on local machine
2. node (and npm) installed

### steps

1. get repo
```sh
$ git clone https://github.com/mentix02/rma
$ cd rma
```
2. install dependencies

```sh
$ npm i
```

3. create database
```sh
$ mysql -u root -p
Enter password: ****

...

mysql> CREATE DATABASE rmaDev;
Query OK, 1 row affected (0.01 sec)

mysql> exit;
```

4. edit `config/config.json` and replace the password field with your own password

5. run migrations

```sh
$ npx sequelize db:migrate
```

6. run server

```
$ npm start
```

Head over to [http://localhost:3000](http://localhost:3000) and enjoy the app!
