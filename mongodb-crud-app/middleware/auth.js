const jwt = require('jsonwebtoken');

// Middleware для аутентификации
exports.authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication token is required' });
    }

    // Декодирование токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Сохраняем информацию о пользователе в запросе
    next();  // Продолжаем обработку запроса
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Middleware для авторизации с поддержкой нескольких ролей
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    // Если не указаны роли, то доступ открыт всем
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();  // Продолжаем обработку запроса
  };
};
