const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

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

    const token = await generarJWT(dbUser.id, name);

    await dbUser.save();

    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name,
      token
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el admin'
    });
  }

  return res.json({
    ok: true,
    msg: 'Crear usuario /new'
  });
}

const loginUsuario = async(req, res = response) => {
  const {email, password} = req.body;

  try {
    const dbUser = await Usuario.findOne({email});

    if(!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo no existe'
      });
    }

    const validPassword = bcrypt.compareSync(password, dbUser.password);

    if(!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'El password no es válido'
      });
    }

    const token = await generarJWT(dbUser.id, dbUser.name);

    return res.json({
      ok: true,
      uid: dbUser.uid,
      name: dbUser.name,
      token
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el admin'
    });
  }
}

const renovarToken = async(req, res = response) => {
  const {uid, name} = req;

  const token = await generarJWT(uid, name);

  return res.json({
    ok: true,
    uid,
    name,
    token
  });
}

module.exports = {
  crearUsuario,
  loginUsuario,
  renovarToken
}