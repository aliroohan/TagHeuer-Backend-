const mongoose = require('mongoose');

const run = async () => {
    await mongoose.connect("mongodb://localhost:27017/tag_heuer", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to MongoDB')
    }).catch((err) => {
        console.log('Error:', err)
    })
}

module.exports = {run};