const express = require("express"); //importar express 
const bodyParser = require("body-parser"); 
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express(); //crear al servidor 
const port = process.env.PORT || 3000; 

app.use(bodyParser.urlencoded({ extended:true})); 
app.use(bodyParser.json()); 
app.use(cors());

// Import the functions you need from the SDKs you need
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAI47_h6GumAc3s85LE4flNrKkaoSY5TI",
  authDomain: "proyecto-final-9469a.firebaseapp.com",
  projectId: "proyecto-final-9469a",
  storageBucket: "proyecto-final-9469a.appspot.com",
  messagingSenderId: "668310300478",
  appId: "1:668310300478:web:496f38b2c0a04726842e6f"
};

const serviceAccount = {
  'type': 'service_account',
  'project_id': 'proyecto-final-9469a',
  'private_key_id': process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  'private_key': (process.env.FIREBASE_ADMIN_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
  'client_email': process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  'client_id': process.env.FIREBASE_ADMIN_CLIENT_ID,
  'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
  'token_uri': 'https://oauth2.googleapis.com/token',
  'auth_provider_x509_cert_url': process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  'client_x509_cert_url': process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
} as ServiceAccount;


// Initialize Firebase

var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = getFirestore();

console.log(db)


app.post('/database', async (req, res) => {
    console.log(req.body)
    const { correo } = req.body;
    const userRef = db.collection('users');
    const user = userRef.where('email', '==', correo);
    const doc = await user.get();
    if (doc.empty) {
    console.log('El documento no existe');
    console.log(correo)
    return;
    } 
    let id = '';
    doc.forEach(doc => {
        id = doc.id;
        console.log(doc.id, '=>', doc.data());
    });
    res.json(id)
})



app.post('/contacto', (req, res) => {
    const { nombre, mensaje } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'herediaandres040@gmail.com',
            pass: "vurg ndfo sdib jcxo",
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: 'herediaandres040@gmail.com',
        to: 'driverent123@gmail.com',
        subject: 'Mensaje de ' + nombre,
        text: mensaje
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo: ', error);
            res.status(500).send('Error al enviar el correo');
        } else {
            console.log('Correo enviado: ' + info.response);
            res.status(200).send('Correo enviado');
            console.log(email);
            console.log(subject);
            console.log(message);
        }
    });
});

app.post('/cita', (req, res) => {
    const { asunto, mensaje, correo } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'driverent123@gmail.com',
            pass: "ilzs ujdr tehu xghk",
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: 'driverent123@gmail.com',
        to: correo,
        subject: asunto,
        text: mensaje
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo: ', error);
            res.status(500).send('Error al enviar el correo');
        } else {
            console.log('Correo enviado: ' + info.response);
            res.status(200).send('Correo enviado');
            console.log(email);
            console.log(subject);
            console.log(message);
        }
    });
});

app.listen(port, () => { 
    console.log(`Servidor ejecutandose en http://localhost:${port}`); 
})
