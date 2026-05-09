# Tiffinity

### _Connecting Home Cooks & Tiffin Service Provider with Nearby Customers for Fresh, Homemade Meals_

> **The problem:**  Professionals subscribing to tiffin services receive pre-decided daily menus with no customization options. Customers endure dishes they dislike 2-3 times weekly but cannot switch to alternatives.No tiffin service allows day-to-day menu selection.

> **The solution:** A city-based pre-order platform where home cooks & tiffin servide provider post their daily menu and nearby customers get fresh, personalized, and cost-effective meals.

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Core Innovation](#-core-innovation)
3. [User Roles & Flows](#-user-roles--flows)
4. [Full Feature List](#-full-feature-list)
5. [Tech Stack](#️-tech-stack)
6. [Database Schema](#️-database-schema)
7. [API Endpoints](#-api-endpoints)
8. [Key Business Logic](#-key-business-logic)
9. [Installation & Setup](#️-installation--setup)

---

## 🎯 Project Overview

| Pain Point                                          | Who Suffers | Tiffinity Solution                                                |
| :-------------------------------------------------- | :---------- | :---------------------------------------------------------------- |
| Expensive restaurant meals (₹150–200/meal)           | Customer    | Affordable home-cooked meals at ₹60–80, no middlemen              |
| Fixed tiffin menus with no customization             | Customer    | Daily meal selection based on personal taste and preferences      |
| Repetitive meals leading to dissatisfaction          | Customer    | Variety of dishes from multiple cooks                        |
| Wasted money due to rigid subscriptions              | Customer    | Flexible ordering without being locked into full subscriptions    |
| Lack of fresh, homemade food options                 | Customer    | Verified home cooks offering authentic regional meals             |
| Food wastage due to uncertain demand                 | Cook        | Pre-order system ensures exact quantity preparation               |
| Unpredictable daily income                           | Cook        | Dashboard with confirmed orders and clear earnings                |
| No direct way for cooks to reach customers           | Cook        | Dedicated profile with menu, photos, ratings, and cuisine         |
---

## ⚡ Core Innovation — The Pre-Order Window

The **2–3 hour pre-order window** is what makes Tiffinity fundamentally different:

```
Swiggy/Zomato  →  Order anytime  →  Reheated food
Tiffinity      →  Pre-order by cutoff  →  Cooked fresh, just for you
```

- 🧑‍🍳 **Cook:** Knows exact quantity before starting → Zero food waste → Certain income
- 🧑‍💼 **Customer:** Food is cooked specifically for your order → Always fresh, never reheated

---

## 👥 User Roles & Flows

### 🥗 Customer Flow

```
Register / Login → Select City
        ↓
Browse Verified Cooks in Your City
        ↓
View Cook Profile + Today's Menu (dish, price, portions left, cutoff time)
        ↓
Place Order before Cutoff → Enter Delivery Address → Confirm COD Order
        ↓
Track Live Status: Confirmed → Preparing → Ready → Delivered
        ↓
Receive Meal → Rate & Review the Cook ⭐
```

### 🍳 Cook Flow

```
Register → Fill Profile (bio, cuisine, city, photo)
        ↓
Wait for Admin Approval
        ↓
Access Cook Dashboard (once approved)
        ↓
Every Morning → Post Today's Menu (dish, photo, price, max portions, cutoff time)
        ↓
Customers Order → Accept or Reject Each Order
        ↓
Update Status: Preparing → Ready → Delivered
        ↓
End of Day → View Earnings Summary 💰
```

### 🛡️ Admin Flow

```
Login to Admin Panel
        ↓
Review Pending Cook Registrations → Approve or Reject
        ↓
Monitor All Active Orders & Platform Analytics
        ↓
Handle Complaints / Ban Users if Required
```

---

## 🔧 Full Feature List

### 🔐 Auth System

- Register & login with email/password
- Role selection at register — **Customer** or **Cook**
- Email OTP verification
- JWT authentication with role-based protected routes
- Forgot password via email OTP

### 🥗 Customer Features

- City-based discovery of verified cooks
- View cook profile — bio, cuisine, rating, reviews
- View today's menu — dish name, photo, price, portions left, cutoff time
- Place order before cutoff time
- Enter delivery address at checkout
- Cash-on-delivery flow (order is created with pending payment status)
- Live order status tracking: `Confirmed → Preparing → Ready → Delivered`
- Full order history
- Rate & review cook after delivery

### 🍳 Cook Features

- Create profile — name, bio, city, cuisine type, photo
- Admin approval gate before going live
- Post daily menu (dish name, price, max portions, cutoff time, photo)
- View incoming orders with customer name & delivery address
- Accept or reject individual orders
- Update order status in real-time
- Earnings dashboard — daily, weekly, monthly summary

### 🛡️ Admin Features

- Approve or reject pending cook registrations
- View all users, cooks, orders
- Platform stats — total users, total orders, active cooks
- Ban users or handle disputes manually

### 🔔 Notifications

- **Email (Resend):** Order placed (to cook), order confirmed (to customer), order delivered
- **In-app bell:** Basic notification panel (including admin alerts for new cook profile submissions)

### ⭐ Review System

- Star rating (1–5) + optional written review
- Only customers who received the order can review
- Cook's average rating recalculated and shown on profile

---

### 🔮 Building in v1.1

| Feature                | Reason Deferred                      |
| :--------------------- | :----------------------------------- |
| Google OAuth           | Keep auth simple for MVP             |
| Real-time Socket.io    | Page polling sufficient for MVP      |
| Live delivery tracking | Cook uses Porter/Dunzo independently |
| In-app chat            | Email notifications sufficient       |
| Subscription plans     | Pay-per-meal is simpler              |
| Payout system          | Manual payouts for MVP               |
| Dispute management     | Admin handles manually               |

---

## 🛠️ Tech Stack

| Layer               | Technology                                                                          |
| :------------------ | :---------------------------------------------------------------------------------- |
| **Frontend**        | React + Redux Toolkit + Tailwind CSS                                                |
| **Backend**         | Node.js + Express.js                                                                |
| **Database**        | MongoDB + Mongoose (Atlas)                                                          |
| **Authentication**  | JWT (JSON Web Tokens)                                                               |
| **Payments**        | COD flow (Razorpay dependency present but payment verification route is not active) |
| **Image Storage**   | Cloudinary                                                                          |
| **Email**           | Resend                                                                              |
| **Frontend Deploy** | Vercel                                                                              |
| **Backend Deploy**  | Render                                                                              |
| **Database Host**   | MongoDB Atlas                                                                       |

---

## 🗄️ Database Schema

### 1. `Users`

```js
{
  name:           String,     // required
  email:          String,     // required, unique
  password:       String,     // bcrypt hashed
  role:           Enum['customer', 'cook', 'admin'],
  city:           String,     // required
  phone:          String,
  avatar:         String,     // Cloudinary URL
  isActive:       Boolean,    // default: true
  resetOTP:       String,
  resetOTPExpiry: Date,
  createdAt:      Date
}
```

### 2. `CookProfiles`

```js
{
  userId:       ref → Users,   // unique
  bio:          String,
  cuisineType:  [String],      // e.g. ['Gujarati', 'Punjabi']
  city:         String,
  address:      String,
  photo:        String,        // Cloudinary URL
  isVerified:   Boolean,       // default: false
  isAvailable:  Boolean,       // default: true
  rating:       Number,        // default: 0
  totalReviews: Number,        // default: 0
  earnings: {
    total:     Number,
    thisMonth: Number,
    thisWeek:  Number
  },
  createdAt: Date
}
```

### 3. `Menus`

```js
{
  cookId:    ref → CookProfiles,
  date:      String,          // 'YYYY-MM-DD' in IST
  mealType:  Enum['lunch', 'dinner'],
  dishes: [{
    name:         String,
    photo:        String,     // stock photo URL
    price:        Number,
    maxPortions:  Number,
    portionsLeft: Number,
    description:  String      // optional
  }],
  cutoffTime: String,         // e.g. '10:00'
  isActive:   Boolean,        // default: true
  createdAt:  Date
}
```

### 4. `Orders`

```js
{
  customerId: ref → Users,
  cookId:     ref → CookProfiles,
  menuId:     ref → Menus,
  dish: {
    name:  String,
    photo: String,
    price: Number
  },
  quantity:        Number,
  totalAmount:     Number,
  deliveryAddress: String,    // required
  status:          Enum['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
  paymentStatus:   Enum['pending', 'paid', 'failed'],
  paymentId:       String,    // Razorpay payment ID
  isReviewed:      Boolean,   // default: false
  createdAt:       Date
}
```

### 5. `Reviews`

```js
{
  customerId: ref → Users,
  cookId:     ref → CookProfiles,
  orderId:    ref → Orders,   // unique
  rating:     Number,         // 1–5, required
  comment:    String,         // optional
  createdAt:  Date
}
```

### 6. `Notifications`

```js
{
  userId:  ref → Users,
  message: String,
  type:    Enum['order_placed', 'order_confirmed', 'order_preparing',
                'order_ready', 'order_delivered', 'order_cancelled',
                'cook_approved', 'cook_profile_submitted'],
  isRead:    Boolean,         // default: false
  createdAt: Date
}
```

---

## 🔌 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint                    | Description             | Auth       |
| :----- | :-------------------------- | :---------------------- | :--------- |
| `POST` | `/api/auth/register`        | Register new user       | Public     |
| `POST` | `/api/auth/login`           | Login user              | Public     |
| `POST` | `/api/auth/forgot-password` | Send OTP to email       | Public     |
| `POST` | `/api/auth/reset-password`  | Reset password with OTP | Public     |
| `GET`  | `/api/auth/me`              | Get logged-in user info | 🔒 Private |
| `POST` | `/api/auth/verify-otp`      | Email OTP verification  | Public     |

### 🍳 Cook Routes

| Method | Endpoint                 | Description                      | Auth    |
| :----- | :----------------------- | :------------------------------- | :------ |
| `POST` | `/api/cook/profile`      | Create cook profile              | 🔒 Cook |
| `GET`  | `/api/cook/profile/me`   | Get own cook profile             | 🔒 Cook |
| `PUT`  | `/api/cook/profile`      | Update cook profile              | 🔒 Cook |
| `GET`  | `/api/cook/all?city=`    | Get all verified cooks by city   | Public  |
| `GET`  | `/api/cook/:id`          | Get single cook profile (public) | Public  |
| `PUT`  | `/api/cook/availability` | Toggle available/unavailable     | 🔒 Cook |

### 📋 Menu Routes

| Method   | Endpoint                  | Description                | Auth    |
| :------- | :------------------------ | :------------------------- | :------ |
| `POST`   | `/api/menu`               | Cook posts today's menu    | 🔒 Cook |
| `GET`    | `/api/menu/today/:cookId` | Get today's menu of a cook | Public  |
| `GET`    | `/api/menu/my`            | Cook sees their own menu   | 🔒 Cook |
| `PUT`    | `/api/menu/:id`           | Update menu                | 🔒 Cook |
| `DELETE` | `/api/menu/:id`           | Delete menu                | 🔒 Cook |
| `GET`    | `/api/menu/all`           | Get all menus              | Public  |
| `GET`    | `/api/menu/history`       | Get all expired menus      | 🔒 Cook |

### 🛒 Order Routes

| Method | Endpoint                 | Description               | Auth        |
| :----- | :----------------------- | :------------------------ | :---------- |
| `POST` | `/api/orders`            | Customer places order     | 🔒 Customer |
| `GET`  | `/api/orders/my`         | Customer's order history  | 🔒 Customer |
| `GET`  | `/api/orders/cook`       | Cook's incoming orders    | 🔒 Cook     |
| `PUT`  | `/api/orders/:id/status` | Cook updates order status | 🔒 Cook     |
| `PUT`  | `/api/orders/:id/cancel` | Customer cancels order    | 🔒 Customer |

### ⭐ Review Routes

| Method | Endpoint                    | Description               | Auth        |
| :----- | :-------------------------- | :------------------------ | :---------- |
| `POST` | `/api/reviews`              | Customer submits review   | 🔒 Customer |
| `GET`  | `/api/reviews/cook/:cookId` | Get all reviews of a cook | Public      |

### 🔔 Notification Routes

| Method | Endpoint                  | Description                    | Auth       |
| :----- | :------------------------ | :----------------------------- | :--------- |
| `GET`  | `/api/notifications`      | Get all notifications for user | 🔒 Private |
| `PUT`  | `/api/notifications/read` | Mark all as read               | 🔒 Private |

### 🛡️ Admin Routes

| Method | Endpoint                      | Description               | Auth     |
| :----- | :---------------------------- | :------------------------ | :------- |
| `GET`  | `/api/admin/cooks/pending`    | Get unverified cooks      | 🔒 Admin |
| `PUT`  | `/api/admin/cooks/:id/verify` | Approve cook              | 🔒 Admin |
| `PUT`  | `/api/admin/cooks/:id/reject` | Reject cook               | 🔒 Admin |
| `GET`  | `/api/admin/users`            | Get all users             | 🔒 Admin |
| `GET`  | `/api/admin/orders`           | Get all orders            | 🔒 Admin |
| `GET`  | `/api/admin/stats`            | Platform stats            | 🔒 Admin |
| `PUT`  | `/api/admin/users/:id/ban`    | Ban a user                | 🔒 Admin |
| `GET`  | `/api/admin/users/:id`        | Single user detailed data | 🔒 Admin |

---

## 🧠 Key Business Logic

| Logic                      | Where                 | How                                                                              |
| :------------------------- | :-------------------- | :------------------------------------------------------------------------------- |
| **Cutoff time check**      | Order/Menu Controller | Compare current IST time with menu `cutoffTime` — reject if passed               |
| **Decrement portions**     | Order Controller      | Decrement selected dish `portionsLeft` in memory, then `menu.save()`             |
| **Auto-close menu**        | Order Controller      | After decrement, if `portionsLeft <= 0` → set `isActive: false`                  |
| **Review gate**            | Review Controller     | Check `order.status === 'delivered'` before saving review                        |
| **Verified cooks only**    | Cook Controller       | Filter by `isVerified: true` in all customer-facing queries                      |
| **Update cook rating**     | Review Controller     | Recalculate average, update `CookProfile.rating`                                 |
| **Email on status change** | Order Controller      | Call `sendEmail()` utility on every status update                                |
| **Create notifications**   | Order Controller      | Create `Notification` doc for both cook and customer                             |
| **City-based discovery**   | Cook Controller       | City filter is query-driven (`/api/cook/all?city=`) using case-insensitive match |
| **Cancellation window**    | Order Controller      | Allow cancel only when `order.status` is `pending` or `confirmed`                |
| **Timezone consistency**   | Menu/Order/Cron Utils | Business date/time and cutoff checks are normalized to IST (`Asia/Kolkata`)      |

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Tiffinity.git
cd Tiffinity
```

### 2. Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in `server/`:

```env
# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/Tiffinity

# Auth
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Image Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
RESEND_API_KEY=your_resend_api_key

# Server
PORT=5000
NODE_ENV=development
```

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Development Server

```bash
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm run dev
```

The API will be live at `http://localhost:5000` and client at `http://localhost:5173`

---

<div align="center">

**Built with ❤️ for home cooks, tiffin service provider and food lovers across India**

_Tiffinity — Where every meal feels like home._

</div>
