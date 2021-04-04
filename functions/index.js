const functions = require("firebase-functions");

const admin = require("firebase-admin");
const serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");

const app = express();

const db = admin.firestore();
app.use( cors( {origin: true} ));

//  Routes

//  Create
//  POST
app.post("/api/create", (req, res) => {
  (async ()=>{
    try {
      await db.collection("product").doc("/" + req.body.id + "/").create({
        typeid: req.body.typeid,
        unit: req.body.unit,
        weight: req.body.weight,
        available: req.body.available,
        icon: req.body.icon,
        machine: req.body.machine,
        name: req.body.name,
        price: req.body.price,
      });

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});


//  Read
//  GET
app.get("/api/read", (req, res) => {
  (async () => {
    try {
      const query = db.collection("product");
      const response = [];

      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs;
        for (const doc of docs) {
          const selectedItem = {
            id: doc.id,
            typeid: doc.data().typeid,
            unit: doc.data().unit,
            weight: doc.data().weight,
            available: doc.data().available,
            icon: doc.data().icon,
            machine: doc.data().machine,
            name: doc.data().name,
            price: doc.data().price,
          };
          response.push(selectedItem);
        }
        return response;
      });

      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

//  Update
//  PUT

//  Delete
//  DELETE

//  Export api to firebase cloud functions
exports.app = functions.https.onRequest(app);
