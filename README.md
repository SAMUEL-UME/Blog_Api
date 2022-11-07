# Blogospot
This is an api for a blog app

---

## Requirements
Users should have a first_name, last_name, email, password,

 A user should be able to sign up and sign in into the blog app

 Use JWT as authentication strategy and expire the token after 1 hour

 A blog can be in two states; draft and published

 Logged in and not logged in users should be able to get a list of published blogs created

 Logged in and not logged in users should be able to to get a published blog

 Logged in users should be able to create a blog.

 When a blog is created, it is in draft state

 The owner of the blog should be able to update the state of the blog to published

 The owner of a blog should be able to edit the blog in draft or published state

 The owner of the blog should be able to delete the blog in draft or published state

 The owner of the blog should be able to get a list of their blogs.

 The endpoint should be paginated

 It should be filterable by state

 Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.

 The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated:

 default it to 20 blogs per page.

 It should also be searchable by author, title and tags.

 It should also be orderable by read_count, reading_time and timestamp

 When a single blog is requested, the api should return the user information (the author) with the blog. The read_count of the blog too should be updated by 1

 Come up with any algorithm for calculating the reading_time of the blog.

---
## Development

## Prerequisites
- Nodejs
- Mongodb

---
## Base URL
- somehostsite.com


## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  username |  string |  required, unique |
|  firs_tname | string  |  required|
|  last_name  |  string |  required  |
|  email     | string  |  required, unique |
|  password |   string |  required  |



### Blog
| field        | data_type  | constraints                                              |
| ------------ | ---------- | -------------------------------------------------------- |
| title        | string     | required, unique                                         |
| description  | string     | optional                                                 |
| author       | ref - User |                                                          |
| owner        | string     |                                                          |
| state        | string     | required, default: 'draft', enum: ['draft', 'published'] |
| read_count   | Number     | default: 0                                               |
| reading_time | Number     |                                                          |
| tags         | array      | optional                                                 |
| body         | string     | required                                                 |




## APIs
---


### Creating a user

- Route: /blogospot/user/signup
- Method: POST

:point_down: Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "mightyjoe",
  "email": "joe@mail.com",
  "password": "Password0!"
}
```

:point_down: Response

```json
{
  "status": "true",
  "data": {
    "first_Name": "John",
    "last_Name": "Doe",
    "username": "mightyjoe",
    "email": "joe@mail.com",
    "_id": "6367c296ba7522bd8561e4f6"
  }
```
---
### Login User

- Route: /blogospot/user/login
- Method: POST
- Body: 
```
{
  "email": "email",
  "password": "password",
}
```

- Responses

Success
```
{
    message: 'Login successful',
}
```

---
### Create Blog


- Route: /blogospot/newblog
- Method: POST
- Header
  - Authorization: cookie {token}

:point_down: Body

```json
{
  "title": "The Adventures of John",
  "tags": ["memoirs", "expose", "fun"],
  "description": "Fun times as Johnny",
  "body": "A very fun article that is long enough to be fun, and short enough to be ..fun!"
}
```

:point_down: Response

```json
{
  "status": "true",
  "data": {
    "title": "The Adventures of John",
    "description": "Fun times as Johnny",
    "author": "6367c296ba7522bd8561e4f6",
    "state": "draft",
    "read_count": 0,
    "tags": ["memoirs", "expose", "fun"],
    "body": "A very fun article that is long enough to be fun, and short enough to be ..fun!",
    "_id": "6367cc2271c384885108032f",
    "createdAt": "2022-11-06T15:00:50.202Z",
    "updatedAt": "2022-11-06T15:00:50.202Z",
    "reading_time": 1
  }
}
```


### Update the contents of a Blog

- Route: /blogospot/update/:id
- Method: PATCH
- Header
  - Authorization: Bearer {token}

:point_down: Body

```json

{
  "tags": ["memoirs", "expose"],
  "body": "A very fun article that is long enough to be fun, and short enough to be ..fun! A sailor went to sea to see what he could see but all that he could see was the bottom of the deep blue sea."
}
```

:point_down: Response

```json
{
  "status": "true",
  "data": {
    "_id": "6367cc2271c384885108032f",
    "title": "The Adventures of John",
    "description": "Fun times as Johnny",
    "author": "6367c296ba7522bd8561e4f6",
    "state": "published",
    "read_count": 0,
    "tags": ["memoirs", "expose"],
    "body": "A very fun article that is long enough to be fun, and short enough to be ..fun! A sailor went to sea to see what he could see but all that he could see was the bottom of the deep blue sea.",
    "createdAt": "2022-11-06T15:00:50.202Z",
    "updatedAt": "2022-11-06T16:22:29.326Z",
    "reading_time": 1
  }
}
```


### Get all Blogs

- Route: /blogospot/blogs
- Method: get


:point_down: Body



-Get all published blogs
-filter by tags
-filter by title




:point_down: Response

```json
{
  "status": "true",
  "data": {
    "_id": "6367cc2271c384885108032f",
    "title": "The Adventures of John",
    "description": "Fun times as Johnny",
    "author": "6367c296ba7522bd8561e4f6",
    "state": "published",
    "read_count": 0,
    "tags": ["memoirs", "expose"],
    "body": "A very fun article that is long enough to be fun, and short enough to be ..fun! A sailor went to sea to see what he could see but all that he could see was the bottom of the deep blue sea.",
    "createdAt": "2022-11-06T15:00:50.202Z",
    "updatedAt": "2022-11-06T16:22:29.326Z",
    "reading_time": 1
  }
}
```

## Contributor
- Samuel Ume
