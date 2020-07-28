const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  number: {
    type: Number,
  },
  color: String,
  date: {
    type: Date,
    default: Date.now
  }
});

if (ContactSchema.name) {
  ContactSchema.email.required = false;
} else if (ContactSchema.email) {
  ContactSchema.name.required = true;
}

module.exports = Contact = mongoose.model('contact', ContactSchema);
