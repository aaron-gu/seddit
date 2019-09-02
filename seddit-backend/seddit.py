from flask import (
    Flask, Blueprint, flash, current_app, g, redirect, render_template, request, session, url_for
)
import sqlite3
import hashlib, uuid, json
from flask_api import FlaskAPI
from flask_cors import CORS


app = FlaskAPI(__name__)
cors = CORS(app)
app.secret_key = 'testtest'
DATABASE = './database.sqlite'


def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def update_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('updateschema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row

    return g.db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    if one:
        rv = cur.fetchone()
    else:
        rv = cur.fetchall()
    cur.close()
    return rv


# res = query_db("SELECT * FROM user")
# if len(res) == 0:
#     print("no users")
# for r in res:
#     print(r['username'])


# try:
#     init_db()
# except:
#     pass

######################## APP ###################


@app.route('/register/', methods=['GET', 'POST'])
def register():
    error = None
    print(request.method)
    if request.method == 'POST':
        username = request.data['username']
        password = request.data['password']
        db = get_db()

        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'
        elif query_db(
            'SELECT id FROM user WHERE username = ?', [username], one=True
        ) is not None:
            error = 'User {} is already registered.'.format(username)

        if error is None:
            salt = uuid.uuid4().hex
            hashed_password = hashlib.sha512((password + salt).encode('utf-8')).hexdigest()
            db.execute(
                'INSERT INTO user (username, password, salt) VALUES (?, ?, ?)',
                (username, hashed_password, salt)
            )
            db.commit()
            return {"status": "OK"}
        
        return {"status": "ERROR", "error": error}
    return {'hello': "world"}

@app.route('/user/<username>/')
def get_user(username):

    res = query_db("SELECT * FROM user")
    if len(res) == 0:
        print("no users")
    for r in res:
        print(r['username'])



        
    user = query_db("SELECT * FROM user WHERE username=(?)", args=[username], one=True)
    if user is not None:
        return {"status": "OK", "user": {"id": user['id'], "username": user['username'], "password": user['password'], "salt": user['salt']}}

def user_to_id(user):
    if user is not None:
        return query_db("SELECT id FROM user WHERE username=(?)", args=[user], one=True)['id']
    return None
    # test gitignore 3


@app.route('/login/', methods=['GET', 'POST'])
def login(): # return an authentication token
    error = None
    if request.method == "POST":
        username = request.data['username']
        password = request.data['password']

        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'
        user = query_db('SELECT * FROM user WHERE username=?', [username], True)
        if user is not None:
            hashed_password = hashlib.sha512((password + user['salt']).encode('utf-8')).hexdigest()
            auth_token = uuid.uuid4().hex
            print(auth_token)
            db = get_db()
            db.execute("UPDATE user SET auth_token=(?) WHERE username=(?)", [auth_token, username])
            db.close()
            # check_user = query_db("SELECT id, username, auth_token FROM user WHERE username=(?)", [username], one=True)
            # if check_user is not None:
            #     print(check_user['auth_token'], check_user['username'])
            if hashed_password == user['password']:
                session.clear()
                session['user_id'] = user['id']
                return {"status": "OK", "auth_token": auth_token}
        error = "Username and/or password is incorrect"
        return {"status": "ERROR", "error": error}

    return {'status': 'GET'}
    # return render_template('login.html', error=error)

@app.route('/post/', methods=["POST"])
def post():
    db = get_db()
    user = request.data['user']
    # auth_token = request.data['auth_token']
    title = request.data['title']
    body = request.data['body']

    if user is None:
        return {"status": "ERROR", "error": "Not logged in"}
    check_user = query_db("SELECT id, username, auth_token FROM user WHERE username=(?)", [user], one=True)
    if check_user is None: # or check_user['auth_token'] != auth_token:
        print(check_user['username'])
        # print(check_user['auth_token'], auth_token)
        return {"status": "ERROR", "error": "Invalid user"}
    user_id = check_user['id']
    if title is not None and body is not None:
        db.execute(
                'INSERT INTO post (author_id, title, body) VALUES (?, ?, ?)',
                (user_id, title, body)
            )
        db.commit()
    else:
        return {"status": "ERROR", "error": "Title and body cannot be blank"}
    
    post = query_db(
            "SELECT post.id, created, title, body, likes, author_id, user.username \
            FROM post INNER JOIN user ON user.id = post.author_id \
            ORDER BY post.id DESC LIMIT 1", one=True
        )
    return {"status": "OK", "post": serialize_post(post)}

@app.route('/like/<int:id>/', methods=["GET", "POST"])
def like(id):
    if request.method == "GET":
        # post_id = request.data['post_id']
        likes = query_db("SELECT COUNT(*) AS num_likes FROM likes WHERE post_id=(?)", [id], one=True)['num_likes']
        # if user_id is not None:
        #     liked = bool(query_db("SELECT COUNT(*) FROM likes WHERE post_id=(?) AND user_id=(?)"), [post_id, user_id])
        #     return {"status": "OK", "likes": likes, "liked": liked}
        return {"status": "OK", "likes": likes}
    else:
        post_id = request.data['post_id']
        user = request.data['user']
        user_id = user_to_id(user)
        if user_id is None:
            return {"status": "ERROR", "error": "invalid user"}
        db = get_db()
        db.execute(
                'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
                (user_id, post_id)
            )
        db.commit()
        return {"status": "OK"}

@app.route('/isliked/', methods=["POST"])
def is_liked():
    post_id = request.data['post_id']
    user = request.data['user']
    user_id = user_to_id(user)
    if user_id is None:
        return {"status": "ERROR", "error": "invalid user"}
    liked = query_db("SELECT COUNT(*) AS liked FROM likes WHERE post_id=(?) AND user_id=(?)", [post_id, user_id], one=True)['liked']
    return {"status": "OK", "liked": bool(liked)}

@app.route('/unlike/', methods=["POST"])
def unliked():
    post_id = request.data['post_id']
    user = request.data['user']
    user_id = user_to_id(user)
    if user_id is None:
        return {"status": "ERROR", "error": "invalid user"}
    db = get_db()
    db.execute(
            'DELETE FROM likes WHERE user_id=(?) AND post_id=(?)',
            (user_id, post_id)
        )
    db.commit()
    return {"status": "OK"}

@app.route('/allcomments/<int:id>/', methods=["GET", "POST"])
def all_comments(id):
    if request.method == "GET":
        comments = query_db("SELECT comment.id, user.username, post_id, created, body, likes \
            FROM comment INNER JOIN user ON user.id = comment.author_id WHERE post_id=(?)", [id])
        comment_list = []
        for comment in comments:
            comment_list.append(serialize_comment(comment))
        return {"status": "OK", "comments": comment_list}
    else:
        user = request.data['user']
        user_id = user_to_id(user)
        if user_id is None:
            return {"status": "ERROR", "error": "invalid user"}
        body = request.data['body']
        db = get_db()
        db.execute(
                'INSERT INTO comment (author_id, post_id, body) VALUES (?, ?, ?)',
                (user_id, id, body)
            )
        db.commit()
        comment = query_db("SELECT comment.id, user.username, post_id, created, body, likes \
            FROM comment INNER JOIN user ON user.id = comment.author_id WHERE post_id=(?) ORDER BY comment.id DESC", 
            [id], one=True)
        return {"status": "OK", "comment": serialize_comment(comment)}

def serialize_comment(comment):
    return {"user": comment['username'], "id": comment['id'], "created": comment['created'],
        "body": comment['body'], "likes": comment['likes']
    }

@app.route('/post/<int:id>/', methods=["GET"])
def get_post(id):
    post = query_db(
            "SELECT created, title, body, likes, author_id, user.username \
            FROM post INNER JOIN user ON user.id = post.author_id \
            WHERE post.id=(?)", args=[id], one=True
        )
    if post is not None:
        return {"status": "OK", \
                "post": serialize_post(post)}
    return {"status": "ERROR", "error": "Post not found"}


@app.route('/feed/<int:page>/', methods=["GET"])
def feed(page):
    feed = query_db(
            "SELECT post.id, created, title, body, likes, author_id, user.username \
            FROM post INNER JOIN user ON user.id = post.author_id \
            ORDER BY post.id DESC LIMIT 10 OFFSET (?)", [page * 10]
        )
    feed_list = []
    for post in feed:
        feed_list.append(serialize_post(post))
    # print(feed_list)
    return {"status": "OK", "feed": feed_list}

def serialize_post(post):
    return {"id": post['id'], "title": post['title'], "author": post['username'], "created": post['created'], \
                "body": post['body'], "likes": post['likes']}

@app.route('/logout/', methods=["POST"])
def logout():
    username = request.data['user']
    get_db().execute("UPDATE user SET auth_token=(?) WHERE username=(?)", ["", username])
    return {"status": "OK"}


# @app.route('/about/')
# def about():
#     return render_template('about.html')

