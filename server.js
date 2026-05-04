require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { sequelize } = require('./models');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: process.env.SESSION_SECRET || 'portfolio-secret-key-2024',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
sessionStore.sync();

// Local vars
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', require('./routes/public'));
app.use('/admin', require('./routes/admin'));

// Sync DB and start
// Sync DB and start
sequelize.sync({ alter: true }).then(async () => {
  const { User } = require('./models');
  const bcrypt = require('bcryptjs');
  const [adminUser, created] = await User.findOrCreate({
    where: { username: process.env.ADMIN_USER || 'admin' },
    defaults: {
      password: await bcrypt.hash(process.env.ADMIN_PASS || 'admin123', 10)
    }
  });
  if (created) console.log('✅ Admin creado:', adminUser.username);

  app.listen(PORT, () => {
    console.log(`🚀 Portfolio corriendo en http://localhost:${PORT}`);
  });
}).catch(err => console.error('Error DB:', err));
