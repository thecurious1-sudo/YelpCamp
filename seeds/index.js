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
      author:'62c4986e33b172400ee8c53b',
      price: price,
      description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores fuga ipsum ab, nam voluptas beatae eum qui esse obcaecati blanditiis, laudantium adipisci minima architecto quaerat sapiente aliquid labore. Maxime, accusamus.',
      images: [
        {
          url: 'https://res.cloudinary.com/deqgjvwad/image/upload/v1657278797/YelpCamp/quucs8omn0bj4vlsghvm.jpg',
          filename: 'YelpCamp/quucs8omn0bj4vlsghvm',
        },
        {
          url: 'https://res.cloudinary.com/deqgjvwad/image/upload/v1657278799/YelpCamp/mvkjw3y0rgfffoyuhr6x.jpg',
          filename: 'YelpCamp/mvkjw3y0rgfffoyuhr6x',
        },
        {
          url: 'https://res.cloudinary.com/deqgjvwad/image/upload/v1657278802/YelpCamp/sngmhvzbzq3mapz8wqrc.jpg',
          filename: 'YelpCamp/sngmhvzbzq3mapz8wqrc',
        }
      ],    
      geometry: { type: 'Point', coordinates: [ -113.133115, 47.020078 ] },
      location: `Ovando Montana`,
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
