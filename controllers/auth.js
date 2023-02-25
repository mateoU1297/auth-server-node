const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const crearUsuario = async(req, res = response) => {
  const {email, name, password} = req.body;

  try {
    let usuario = await Usuario.findOne({email}); 

    if(usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario ya existe con ese email'
      });
    }

    const dbUser = new Usuario(req.body);

    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);

    await dbUser.save();

    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name
    });

  } catch (error) {
    
  }

  return res.json({
    ok: true,
    msg: 'Crear usuario /new'
  });
}

const loginUsuario = (req, res = response) => {
  const {email, password} = req.body;

  return res.json({
    ok: true,
    msg: 'Login de usuario /'
  });
}

const renovarToken = (req, res = response) => {
  return res.json({
    ok: true,
    msg: 'Renew'
  });
}

module.exports = {
  crearUsuario,
  loginUsuario,
  renovarToken
}