const { Router } = require('express');
const { loginUsuario, crearUsuario, renovarToken } = require('../controllers/auth');

const router = Router();

router.post('/new', crearUsuario);

router.post('/', loginUsuario);

router.get('/renew', renovarToken);

module.exports = router;