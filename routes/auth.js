const { Router } = require('express');
const { check } = require('express-validator');
const { loginUsuario, crearUsuario, renovarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/new', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'El password es obligatorio').isLength({min: 6}),
  validarCampos
], crearUsuario);

router.post('/', [
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'El password es obligatorio').isLength({min: 6}),
  validarCampos
], loginUsuario);

router.get('/renew', [
  validarCampos
], renovarToken);

module.exports = router;