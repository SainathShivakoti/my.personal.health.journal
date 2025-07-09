# Corrected version of app.py with full structure
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# --- Data paths ---
USERS_FILE = 'users.json'
JOURNAL_DIR = 'journal_data'

if not os.path.exists(JOURNAL_DIR):
    os.makedirs(JOURNAL_DIR)
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, 'w') as f:
        json.dump({}, f)

# --- Helper functions ---
def load_users():
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=4)

def get_user_journal_file(username):
    return os.path.join(JOURNAL_DIR, f'{username}_journal.json')

def load_user_journal(username):
    journal_file = get_user_journal_file(username)
    if os.path.exists(journal_file):
        with open(journal_file, 'r') as f:
            return json.load(f)
    return []

def save_user_journal(username, entries):
    journal_file = get_user_journal_file(username)
    with open(journal_file, 'w') as f:
        json.dump(entries, f, indent=4)

# --- Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    users = load_users()

    if username in users:
        return jsonify({'message': 'Username already exists'}), 409

    users[username] = {'password': password}
    save_users(users)
    return jsonify({'message': 'Registration successful'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    users = load_users()

    user = users.get(username)
    if user and user['password'] == password:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    username = data.get('username')
    new_password = data.get('new_password')

    users = load_users()
    if username not in users:
        return jsonify({'message': 'Username not found'}), 404

    users[username]['password'] = new_password
    save_users(users)
    return jsonify({'message': 'Password reset successfully.'}), 200

@app.route('/journal/save', methods=['POST'])
def save_journal():
    data = request.get_json()
    username = data.get('username')
    field_id = data.get('field_id')
    content = data.get('content')

    if not all([username, field_id is not None, content is not None]):
        return jsonify({'message': 'Missing data'}), 400

    if not content.strip():
        return jsonify({'message': 'Empty content not saved'}), 204

    journal_entries = load_user_journal(username)

    found = False
    for entry in journal_entries:
        if entry['field_id'] == field_id:
            entry['content'] = content
            found = True
            break

    if not found:
        journal_entries.append({'field_id': field_id, 'content': content})

    save_user_journal(username, journal_entries)
    return jsonify({'message': 'Journal entry saved'}), 200

@app.route('/journal/load', methods=['GET'])
def load_journal():
    username = request.args.get('username')
    if not username:
        return jsonify({'message': 'Username required'}), 400

    entries = load_user_journal(username)
    return jsonify(entries), 200

if __name__ == '__main__':
    app.run(debug=True)
