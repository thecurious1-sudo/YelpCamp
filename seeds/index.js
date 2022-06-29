const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')

mongoose
  .connect('mongodb://localhost:27017/yelpCamp')
  .then(() => {
    console.log('Connection established!')
  })
  .catch(err => {
    console.log(err)
  })
db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
  db.once('close', () => {
    console.log('CLOSED')
  })
})

const returnRandomArrayElement = array =>
  array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  console.log(returnRandomArrayElement(descriptors))
  for (let i = 0; i < 50; i++) {
    const price= Math.floor(Math.random()*30)+10;
    const cities_index = Math.floor(Math.random() * 1000)
    const temp = new Campground({
      price: price,
      description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores fuga ipsum ab, nam voluptas beatae eum qui esse obcaecati blanditiis, laudantium adipisci minima architecto quaerat sapiente aliquid labore. Maxime, accusamus.',
      image:'https://source.unsplash.com/collection/483251',
      location: `${cities[cities_index].city}, ${cities[cities_index].state}`,
      title: `${returnRandomArrayElement(
        descriptors
      )} ${returnRandomArrayElement(places)} `
    })
    await temp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
  //console.log(Campground.find({}))
})
