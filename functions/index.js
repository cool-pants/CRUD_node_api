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


//  Read all
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

//  Read one
//  GET
app.get("/api/read/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("product").doc(req.params.id);
      const product = await document.get();
      const response = product.data();

      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

//  Update
//  PUT
app.put("/api/update/:id", (req, res) => {
  (async ()=>{
    try {
      const document = db.collection("product").doc(req.params.id);

      await document.update({
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

//  Delete
//  DELETE
app.delete("/api/delete/:id", (req, res) => {
  (async ()=>{
    try {
      const document = db.collection("product").doc(req.params.id);

      await document.delete();

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

//  Create Bill
//  POST
app.post("/api/bill", (req, res) => {
  (async ()=>{
    try {
      const val = Math.floor(10 + Math.random() * 90);
      await db.collection("bill").doc("/" + req.body.id + "/").create({
        name: req.body.name,
        item_id: req.body.item_id,
        bill_id: val+req.body.name,
      });

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});


//  Read Bills for current user with name
//  GET
app.get("/api/getBill/:name", (req, res) => {
  (async () => {
    try {
      const document = db.collection("bill").doc(req.params.name);
      const bill = await document.get();
      const response = bill.data();

      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

//  Read One Bill
//  GET
app.get("/api/getBill/:name/bill/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("bill").doc(req.params.id);
      const bill = await document.get();
      const response = bill.data();

      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});


//  Update
//  PUT
app.put("/api/updateBill/:id", (req, res) => {
  (async ()=>{
    try {
      const document = db.collection("bill").doc(req.params.id);

      await document.update({
        name: req.body.name,
        item_id: req.body.item_id,
      });

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

//  Delete
//  DELETE
app.delete("/api/billDelete/:id", (req, res) => {
  (async ()=>{
    try {
      const document = db.collection("bill").doc(req.params.id);

      await document.delete();

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});


//  Export api to firebase cloud functions
exports.app = functions.https.onRequest(app);
