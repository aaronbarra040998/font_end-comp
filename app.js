// app.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Middleware para sesiones
app.use(session({
    secret: 'tu_secreto_secreto',
    resave: false,
    saveUninitialized: true
}));

// Middleware para servir archivos estáticos desde la carpeta "assets"
app.use('/assets', express.static('assets'));
app.use('/css', express.static('assets/css'));

// Middleware de autenticación
const authenticate = (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (req.session.empresaId) {
        // Si está autenticado, continuar con la siguiente ruta
        next();
    } else {
        // Si no está autenticado, redirigir al inicio
        res.redirect('/');
    }
};

// Ruta de inicio redirigida a la ruta /home
app.get('/', (req, res) => {
    // Renderizar la vista home con el estado de la sesión
    const empresaDetails = req.session.empresaId ? {} : null;
    res.render('home', { empresaDetails });
});

// Ruta de login
app.get('/login', (req, res) => {
    res.render('index'); // Asegúrate de tener una vista llamada "login.ejs"
});

app.post('/login', async (req, res) => {
    try {
        // Hacer solicitud a tu API de login
        const response = await axios.post('http://localhost:9000/api/login', {
            usuario: req.body.usuario,
            password: req.body.password,
        });

        const { success, empresa } = response.data;

        if (success === 'Login correcto' && empresa) {
            // Guardar el ID de la empresa en la sesión
            req.session.empresaId = empresa;

            // Redirigir a la ruta /home con el ID de la empresa
            res.redirect(`/home/${empresa}`);
        } else {
            // Otro tipo de lógica de respuesta
            res.render('login-error');
        }
    } catch (error) {
        console.error(error);
        res.render('login-error');
    }
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    // Destruir la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        // Redirigir al inicio después de cerrar sesión
        res.redirect('/');
    });
});

// Ruta para mostrar detalles de la empresa en /home
app.get('/home/:id', authenticate, async (req, res) => {
    try {
        // Obtener el ID de la empresa almacenado en la sesión
        const empresaId = req.session.empresaId;

        // Hacer la solicitud a tu API de empresa
        const empresaResponse = await axios.get(`http://localhost:9000/api/empresa/${empresaId}`);

        // Modificar la URL de la imagen para incluir el host
        const empresaDetails = {
            ...empresaResponse.data,
            imagen: 'http://localhost:9000/' + empresaResponse.data.imagen,
        };

        // Renderizar vista de éxito con detalles de la empresa
        res.render('home', { empresaDetails });
    } catch (error) {
        console.error(error);
        res.render('login-error');
    }
});

// Ruta para mostrar detalles de la empresa en /home
app.get('/parking', authenticate, async (req, res) => {
    try {
        // Obtener el ID de la empresa almacenado en la sesión
        const empresaId = req.session.empresaId;

        // Check if the user is authenticated
        if (!empresaId) {
            // Redirect to the notify page if the user is not authenticated
            return res.redirect('/notify');
        }

        // Hacer la solicitud a tu API de empresa
        const empresaResponse = await axios.get(`http://localhost:9000/api/empresa/${empresaId}`);

        // Modificar la URL de la imagen para incluir el host
        const empresaDetails = {
            ...empresaResponse.data,
            imagen: 'http://localhost:9000/' + empresaResponse.data.imagen,
        };

        // Renderizar vista de parking con detalles de la empresa
        res.render('parking', { empresaDetails });
    } catch (error) {
        console.error(error);
        res.render('login-error');
    }
});

// Ruta para la página de notificación (notify)
app.get('/notify', (req, res) => {
    res.render('notify'); // Asegúrate de tener una vista llamada "notify.ejs"
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
