# ExpenseWise

✨ **Key Features**

- ➕ Admin can create employees and managers within a company
- 🔄 Assign and change managers for employees
- ✅ Employee can submit expenses (amount, category, description, receipt)
- 🗂 View personal expense history (Approved, Rejected)
- 📊 Multi-level approval workflow based on role, sequence, and conditional rules
- 💼 Admin-configurable approval rules: Percentage, Specific, Hybrid
- 🧠 Manager-first approval and mandatory steps support
- 📧 Email notifications on approval actions
- 🧾 OCR integration for auto-reading receipts
- 🔎 Search, filter, and sort expenses (by date, amount, category, status)
- 🛠 Real-time updates with React hooks
---

## 🛠 Tech Stack Overview

| Component      | Technology                        |
| -------------- | --------------------------------- |
| Frontend       | React.js, TailwindCSS             |
| Backend        | Node.js, Express.js               |
| Database       | MongoDB, Mongoose                 |
| Authentication | JWT (Access & Refresh Tokens)     |
| Email          | Zoho Mail                         |
| OCR            | AWS Textract                      |
| API            | RESTcountries                     |

---

## 🔧 Development Approach

| Aspect       | Details                                                                |
| ------------ | ---------------------------------------------------------------------- |
| Language     | JavaScript (ES6+, Node.js, React.js)                                   |
| Design       | Modular structure with reusable components and services                |
| Git Strategy | Clear, semantic commits and branching                                  |

---

## 🚀 Getting Started

### 📁 Clone This Repository

```bash
git clone https://github.com/kartikkaram/odoo_hackathon_expense_management.git
cd odoo_hackathon_expense_management
```

---

### 🖥 Frontend Setup (Client)

```bash
cd client
npm install
npm start
```

Frontend will run at: [http://localhost:5173](http://localhost:5173)

---

### 💻 Backend Setup (Server)

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URL=<your_mongodb_connection_string>
ACCESS_TOKEN_SECRET=<your_access_token_secret>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
REFRESH_TOKEN_EXPIRY=7d
AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
AWS_REGION=ap-south-1
GEMINI_API_KEY=<your_gemini_api_key>
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_cloud_api_key>
CLOUDINARY_API_SECRET=<your_cloud_api_secret>
ZOHO_CLIENT_ID=<your_zoho_client_id>
ZOHO_CLIENT_SECRET=<your_zoho_client_secret>
ZOHO_REFRESH_TOKEN=<your_zoho_refresh_token>
ZOHO_ACCOUNT_ID=<your_zoho_account_id>
ZOHO_REGION=in
ZOHO_FROM_EMAIL=<your_sending_email>
```

Start the backend:

```bash
npm run dev
```

API server will be available at: [http://localhost:5000](http://localhost:5000)

---

## 📸 Screenshots


[![Expense Submission](https://i.ibb.co/cSTqdDrN/Screenshot-2025-10-04-182840.png)](https://ibb.co/S4vSpR3K)


[![Expense History](https://i.ibb.co/LXVCVX7n/Screenshot-2025-10-04-182817.png)](https://ibb.co/Pvq5qvHw)

 
[![Dashboard](https://i.ibb.co/xSCfK3n6/Screenshot-2025-10-04-181537.png)](https://ibb.co/JRByWCYH)

 
[![Expense Submission](https://i.ibb.co/fGL1Cw3J/Screenshot-2025-10-04-181407.png)](https://ibb.co/jZs6LXCt)


[![Approval Workflow](https://i.ibb.co/3YT5kqBL/Screenshot-2025-10-04-181351.png)](https://ibb.co/TqwDrSmF)


[![Expense History](https://i.ibb.co/mCJKvwdB/Screenshot-2025-10-04-181339.png)](https://ibb.co/27qr8QR6)

 
[![Manager Approval](https://i.ibb.co/NgRsChBt/Screenshot-2025-10-04-181311.png)](https://ibb.co/zWdrxcvQ)


[![Dashboard Screenshot](https://i.ibb.co/bMRGYpYW/Screenshot-2025-10-04-181240.png)](https://ibb.co/B5KYv8vz)


[![Users Screenshot](https://i.ibb.co/tpZXYRpR/Screenshot-2025-10-04-181217.png)](https://ibb.co/RThyQ8T8)


---

## 📄 License

This project was developed as an educational demonstration and is not intended for production use.

---

## 🙏 Acknowledgements

* Built as part of odoo hackathon
* Designed using best practices for **React**, and **Node.js**
* Gemini used for workflow suggestions, code improvements, and documentation

---
