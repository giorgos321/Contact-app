const express = require('express');
const router = express.Router();
const Contact = require('../models/ContactModel');

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });

    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:contact_id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contact_id);
    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, number, dial, color } = req.body;

    let contact = await Contact.findOne({ name });
    if (contact) {
      console.log('This name was taken by another contact');
      return res
        .status(400)
        .json({ msg: 'This name was taken by another contact' });
    }
    contact = new Contact({ name, email, dial, color, number });
    await contact.save();
    res.json({ msg: 'Contact Added' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/bulkdelete', async (req, res) => {
  try {
    const { ids } = req.body;

    await Contact.deleteMany({ _id: { $in: ids } });

    res.json({ msg: 'Contacts Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:contact_id', async (req, res) => {
  try {
    let { name, email, number, dial, color } = req.body;

    let contact = await Contact.findById(req.params.contact_id);

    contact.name = name;
    contact.email = email;
    contact.number = number;
    contact.dial = dial;
    contact.color = color;
    await contact.save();
    res.json({ msg: 'Contact Updated' });
  } catch {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:contact_id', async (req, res) => {
  try {
    await Contact.findOneAndRemove({ _id: req.params.contact_id });
    res.json({ msg: 'Contact Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
