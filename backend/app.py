# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime
import re
import hashlib
import os
import bcrypt

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

def get_connection():
    return mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        database=os.getenv('DB_NAME'),
    )

def is_valid_date(s):
    if not s:
        return True
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', s):
        return False
    try:
        datetime.strptime(s, '%Y-%m-%d')
        return True
    except:
        return False

def is_valid_phone(s):
    if not s:
        return True
    return bool(re.match(r'^[\d\+\-\s]{7,15}$', s))

def is_valid_email(s):
    if not s:
        return True
    return bool(re.match(r'^[^@]+@[^@]+\.[^@]+$', s))


@app.route('/api/donors', methods=['GET', 'POST'])
def donors():
    if request.method == 'POST':
        data = request.json or {}
        name = data.get('full_name', '').strip()
        blood_group = data.get('blood_group', '').strip()

        if not name:
            return jsonify({'error': 'Full Name required'}), 400
        if not blood_group:
            return jsonify({'error': 'Blood Group required'}), 400

        if data.get('dob') and not is_valid_date(data['dob']):
            return jsonify({'error': 'Invalid DOB'}), 400
        if data.get('contact') and not is_valid_phone(data['contact']):
            return jsonify({'error': 'Invalid contact'}), 400
        if data.get('email') and not is_valid_email(data['email']):
            return jsonify({'error': 'Invalid email'}), 400

        try:
            conn = get_connection()
            cur = conn.cursor()
            cur.execute("""INSERT INTO Donor
                (Full_Name, Gender, DOB, Contact_No, Email, Medical_History, Organ_Eligibility, Blood_Group, Address)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """, (
                name, data.get('gender') or None, data.get('dob') or None,
                data.get('contact') or None, data.get('email') or None,
                data.get('medical') or None, bool(data.get('organ')),
                blood_group, data.get('address') or None
            ))
            conn.commit()
            conn.close()
            return jsonify({'message': 'Donor added'}), 201
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
        SELECT 
          d.Donor_ID,
          d.Full_Name,
          d.Blood_Group,
          d.Gender,
          d.Contact_No,
          d.Email,
          CASE 
            WHEN EXISTS (SELECT 1 FROM Donation WHERE Donor_ID = d.Donor_ID AND Donation_Type = 'Blood')
                 AND EXISTS (SELECT 1 FROM Donation WHERE Donor_ID = d.Donor_ID AND Donation_Type = 'Organ')
                 THEN 'Blood & Organs'
            WHEN EXISTS (SELECT 1 FROM Donation WHERE Donor_ID = d.Donor_ID AND Donation_Type = 'Organ')
                 THEN 'Organs'
            WHEN EXISTS (SELECT 1 FROM Donation WHERE Donor_ID = d.Donor_ID AND Donation_Type = 'Blood')
                 THEN 'Blood'
            WHEN d.Organ_Eligibility = 1 THEN 'Organs'
            ELSE 'Blood'
          END AS Donation_Status,
          COUNT(don.Donation_ID) AS Total_Donations,
          MAX(don.Donation_Date) AS Last_Donation
        FROM Donor d
        LEFT JOIN Donation don ON d.Donor_ID = don.Donor_ID
        GROUP BY d.Donor_ID
        ORDER BY d.Donor_ID DESC;
        """)
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        data = [dict(zip(cols, r)) for r in rows]
        conn.close()
        return jsonify({'data': data})
    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/recipients', methods=['POST'])
def add_recipient():
    data = request.json or {}
    if not data.get('full_name'):
        return jsonify({'error': 'Full Name required'}), 400
    quantity = data.get('quantity', 1)
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SET @quantity = %s;", (quantity,))
        cur.execute("""INSERT INTO Recipient
            (Full_Name, Gender, DOB, Contact_No, Email, Medical_Condition, Required_Organ, Required_Blood_Group, Address)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            data.get('full_name'),
            data.get('gender') or None,
            data.get('dob') or None,
            data.get('contact') or None,
            data.get('email') or None,
            data.get('medical') or None,
            data.get('required_organ') or None,
            data.get('required_blood') or None,
            data.get('address') or None
        ))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Recipient added'}), 201
    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/donations', methods=['POST'])
def add_donation():
    data = request.json or {}
    donor_id = str(data.get('donor_id') or '').strip()
    don_date = data.get('date') or ''
    don_type = data.get('type') or 'Blood'
    organ_type = data.get('organ_type') or None
    qty = data.get('qty') or 1
    verified = data.get('verified') or None

    if not donor_id.isdigit():
        return jsonify({'error': 'Donor ID must be numeric'}), 400
    if not don_date or not is_valid_date(don_date):
        return jsonify({'error': 'Valid donation date required (YYYY-MM-DD)'}), 400
    if don_type == 'Blood':
        try:
            qty = int(qty)
            if qty < 1:
                raise ValueError()
        except:
            return jsonify({'error': 'Blood quantity must be >= 1'}), 400
    else:
        if not organ_type:
            return jsonify({'error': 'Organ Type required for organ donations'}), 400
        qty = 1

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""INSERT INTO Donation (Donor_ID, Donation_Date, Donation_Type, Organ_Type, Quantity, Verified_By)
                       VALUES (%s, %s, %s, %s, %s, %s)""",
                    (int(donor_id), don_date, don_type,
                     organ_type if don_type == "Organ" else None,
                     int(qty), int(verified) if verified else None))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Donation recorded'}), 201
    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/requests/pending', methods=['GET'])
def pending_requests():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
        SELECT 
          r.Request_ID,
          r.Requestor_Type,
          COALESCE(rec.Full_Name, h.Hospital_Name) AS Requestor_Name,
          r.Request_Type,
          r.Req_Blood_Group,
          r.Organ_Type,
          r.Quantity,
          r.Request_Date,
          r.Status
        FROM RequestTbl r
        LEFT JOIN Recipient rec ON r.Recipient_ID = rec.Recipient_ID
        LEFT JOIN Hospital h ON r.Hospital_ID = h.Hospital_ID
        WHERE r.Status = 'Pending'
        ORDER BY r.Request_Date;
        """)
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        data = [dict(zip(cols, r)) for r in rows]
        conn.close()
        return jsonify({'data': data})
    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/requests/fulfill', methods=['POST'])
def fulfill_request():
    data = request.json or {}
    rid = data.get('request_id')
    sid = data.get('staff_id')
    if not str(rid).isdigit() or not str(sid).isdigit():
        return jsonify({'error': 'Enter numeric Request ID and Staff ID'}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.callproc('sp_fulfill_request', (int(rid), int(sid)))
        conn.commit()
        conn.close()
        return jsonify({'message': f'Request {rid} fulfilled'}), 200
    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/donations/stats', methods=['GET'])
def donation_stats():
    try:
        conn = get_connection()
        cur = conn.cursor(dictionary=True)

        # Donations per day (last 7 days)
        cur.execute("""
            SELECT 
                DATE(Donation_Date) AS date, 
                COUNT(*) AS count
            FROM Donation
            WHERE Donation_Date >= CURDATE() - INTERVAL 7 DAY
            GROUP BY DATE(Donation_Date)
            ORDER BY DATE(Donation_Date);
        """)
        daily_counts = cur.fetchall()

        # Donations by type (Blood vs Organ type)
        cur.execute("""
            SELECT 
                CASE 
                    WHEN Donation_Type = 'Blood' THEN 'Blood'
                    ELSE Organ_Type
                END AS type,
                COUNT(*) AS count
            FROM Donation
            GROUP BY CASE 
                    WHEN Donation_Type = 'Blood' THEN 'Blood'
                    ELSE Organ_Type
                END;
        """)
        type_distribution = cur.fetchall()

        conn.close()
        return jsonify({
            "daily_counts": daily_counts,
            "type_distribution": type_distribution
        })
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/inventory', methods=['GET'])
def inventory():
    inv = request.args.get('type', 'Blood_Inventory')
    if inv not in ('Blood_Inventory', 'Organ_Inventory'):
        return jsonify({'error': 'Invalid inventory type'}), 400
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(f"SELECT * FROM {inv} LIMIT 1000")
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        data = [dict(zip(cols, r)) for r in rows]
        conn.close()
        return jsonify({'data': data})
    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').encode('utf-8')

    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    try:
        conn = get_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM Staff WHERE Username = %s", (username,))
        user = cur.fetchone()
        conn.close()

        if not user:
            return jsonify({'error': 'Invalid username or password'}), 401

        stored_hash = user['Password_Hash'].encode('utf-8')

        if not bcrypt.checkpw(password, stored_hash):
            return jsonify({'error': 'Invalid username or password'}), 401

        # Remove sensitive info before returning
        user.pop('Password_Hash', None)
        return jsonify({'message': 'Login successful', 'user': user}), 200

    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/staff', methods=['POST'])
def add_staff():
    data = request.get_json()
    required_fields = ['full_name', 'role', 'username', 'password']

    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"error": "Missing required fields."}), 400

    full_name = data.get('full_name')
    role = data.get('role')
    contact = data.get('contact')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not re.match(r"^[A-Za-z0-9_]{3,}$", username):
        return jsonify({"error": "Invalid username format."}), 400
    if email and not is_valid_email(email):
        return jsonify({"error": "Invalid email address."}), 400
    if contact and not is_valid_phone(contact):
        return jsonify({"error": "Invalid contact number."}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM staff WHERE Username = %s OR Email = %s",
            (username, email)
        )
        existing = cursor.fetchone()
        if existing:
            return jsonify({"error": "Username or Email already exists."}), 400

        password_hash = password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        cursor.execute("""
            INSERT INTO staff (Full_Name, Role, Contact_No, Email, Username, Password_Hash)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (full_name, role, contact, email, username, password_hash))
        conn.commit()

        return jsonify({"message": "Staff member added successfully!"}), 201

    except mysql.connector.Error as e:
        print("Error adding staff:", e)
        return jsonify({"error": "Database error occurred."}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/staff', methods=['GET'])
def list_staff():
    try:
        conn = get_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT Staff_ID, Full_Name, Role, Contact_No, Email, Username FROM Staff ORDER BY Staff_ID DESC;")
        rows = cur.fetchall()
        conn.close()
        return jsonify({"data": rows}), 200
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, port=5000)
