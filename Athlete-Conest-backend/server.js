// Import required modules
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session');
const nodemailer = require('nodemailer');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: false,
  })
);

// Serve static files
app.use('/Athlete-Conest', express.static(path.resolve(__dirname, '../Athlete-Conest')));
app.use('/uploads', express.static(path.resolve(__dirname, '../Athlete-Conest/uploads')));

// MongoDB connection using async/await
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
})();

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String }, // Added field for profile picture URL
});

const User = mongoose.model('User', userSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '../Athlete-Conest/uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Event schema and model
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  date: Date,
  contactDetails: String,
  images: [String],
  videos: [String],
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model('Event', eventSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Athlete-Conest/HTML/indexlogin.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Athlete-Conest/HTML/LOGINHTML/userlogin.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Athlete-Conest/HTML/home.html'));
});

// Serve the upload-event page
app.get('/upload-event', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Athlete-Conest/HTML/upload-event.html'));
});

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log('User registered:', user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error in registration:', err.message);
    res.status(500).send('Server error');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    console.log(`User logged in successfully: ${email}`);
    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error in login:', err.message);
    return res.status(500).send('Server error');
  }
});

// Fetch profile data of the logged-in user
app.get('/profile', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(req.session.userId, 'username email profilePicture');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).send('Server error');
  }
});

// Edit profile route
app.post('/edit-profile', upload.single('profile-picture'), async (req, res) => {
  const { name, email } = req.body;
  const profilePicture = req.file ? '/uploads/' + path.basename(req.file.path) : null;

  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = name || user.username;
    user.email = email || user.email;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    console.log('Profile updated:', user);
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).send('Server error');
  }
});

// Forgot password route
app.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const resetToken = Math.random().toString(36).substring(2);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link below to reset your password:\n\nhttp://localhost:${port}/reset-password?token=${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Error sending email');
      }
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Password reset link sent to email' });
    });
  } catch (err) {
    console.error('Error resetting password:', err.message);
    res.status(500).send('Server error');
  }
});

// Upload event details, photos, and videos
app.post('/uploadevent', upload.fields([{ name: 'photos', maxCount: 5 }, { name: 'videos', maxCount: 2 }]), async (req, res) => {
  const { title, description, location, date, contactDetails } = req.body;
  const imageFiles = req.files['photos'] || [];
  const videoFiles = req.files['videos'] || [];

  try {
    const images = imageFiles.map(file => '/uploads/' + path.basename(file.path));
    const videos = videoFiles.map(file => '/uploads/' + path.basename(file.path));

    const event = new Event({
      title,
      description,
      location,
      date,
      contactDetails,
      images,
      videos,
    });

    await event.save();
    console.log('Event uploaded:', event);
    res.status(201).json({ message: 'Event uploaded successfully', event });
  } catch (err) {
    console.error('Error uploading event:', err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all events
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err.message);
    res.status(500).send('Server error');
  }
});

// Logout route - added for handling the logout functionality
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }

    res.clearCookie('connect.sid'); // Clear the session cookie
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
