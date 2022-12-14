const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const dbUrl =
  "mongodb://savatar:Sm9BBub3eqYDLtV@ac-4rrzn6s-shard-00-00.jiaiezb.mongodb.net:27017,ac-4rrzn6s-shard-00-01.jiaiezb.mongodb.net:27017,ac-4rrzn6s-shard-00-02.jiaiezb.mongodb.net:27017/?ssl=true&replicaSet=atlas-pugmm5-shard-0&authSource=admin&retryWrites=true&w=majority";

console.log(dbUrl);
// const dbUrl="mongodb://0.0.0.0:27017/yelpCamp";
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connection established!");
  })
  .catch((err) => {
    console.log(err);
  });
db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
  db.once("close", () => {
    console.log("CLOSED");
  });
});

const returnRandomArrayElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const price = Math.floor(Math.random() * 30) + 10;
    const cities_index = Math.floor(Math.random() * 1000);
    const temp = new Campground({
      author: "6399e140d36d765fe5e80009",
      price: price,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores fuga ipsum ab, nam voluptas beatae eum qui esse obcaecati blanditiis, laudantium adipisci minima architecto quaerat sapiente aliquid labore. Maxime, accusamus.",
      images: [
        {
          url: "https://res.cloudinary.com/deqgjvwad/image/upload/v1657913938/YelpCamp/i2giqsx6otscvto6hpjs.jpg",
          filename: "YelpCamp/i2giqsx6otscvto6hpjs",
        },
        {
          url: "https://res.cloudinary.com/deqgjvwad/image/upload/v1657913943/YelpCamp/nzjkuwmt8n45bwf6h5ld.jpg",
          filename: "YelpCamp/nzjkuwmt8n45bwf6h5ld",
        },
        {
          url: "https://res.cloudinary.com/deqgjvwad/image/upload/v1657913947/YelpCamp/cilmd6k5zqnqtgkso1mr.jpg",
          filename: "YelpCamp/cilmd6k5zqnqtgkso1mr",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [
          cities[cities_index].longitude,
          cities[cities_index].latitude,
        ],
      },
      location: `${cities[cities_index].city}, ${cities[cities_index].state}`,
      title: `${returnRandomArrayElement(
        descriptors
      )} ${returnRandomArrayElement(places)} `,
    });
    await temp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  //console.log(Campground.find({}))
});
