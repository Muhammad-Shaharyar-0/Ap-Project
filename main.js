const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/auth");
const app = express();
const uuid=require('uuid');
const moment=require('moment')

const firebaseConfig = {
  apiKey: "AIzaSyCtCT7Et6ukWw6Alok-PYzWg3ZK7s9x9pk",
  authDomain: "project-dff1f.firebaseapp.com",
  databaseURL: "https://project-dff1f.firebaseio.com",
  projectId: "project-dff1f",
  storageBucket: "project-dff1f.appspot.com",
  messagingSenderId: "469353822648",
  appId: "1:469353822648:web:b2622b46eacdc56232b74d"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

//handlebar middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//app.set('view options', { layout: 'other' });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



//Main Page
app.get('/', (req, res) => {

    Themes = [];
    let venueRef = db.collection('venue');
    let Allvenueref = venueRef.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          if (flag == 0) {
            Allvenues.push(doc.data());
       
           var x = true;
           //Checking If Venue Is Featured Or Not Also Checking It Expiry Date
           if(doc.data().Featured==x)
           {
             if(doc.data().Expire==moment().format("YYYY-MM-D"))
             {
                 var x=false;
                 let venueRef = db.collection('venue').doc(doc.data().Name);
                 let setWithOptions = venueRef.set({
                 Featured: x,
                 Expire: ""
              }, { merge: true });
                  normalvenues.push(doc.data())
             }
             else
               Featuredvenues.push(doc.data())
            }
           else
              normalvenues.push(doc.data())
          }
        });
      }).then(function () {
        // console.log(venues);
        res.render('home', { venues: Featuredvenues,Nvenues: normalvenues })
        flag=1;
        // res.render('BookedParties')
      }
      )
      .catch(err => {
        console.log('Error getting documents', err);
      });
});

//Main Scress For Hos After Loggingin 
app.get('/Host', (req, res) => {

    Themes = [];
    let venueRef = db.collection('venue');
    let Allvenues = venueRef.where('Owner','==',currentuser.Name).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          if (flag == 0) {
            yourvenues.push(doc.data());
          }
        });
      }).then(function () {
        // console.log(venues);
        res.render('Host', { venues: yourvenues })
        flag=1;
      }
      )
      .catch(err => {
        console.log('Error getting documents', err);
      });

});

//Chaning Navigation Bar After User logsIn
app.get('/changelayouts/:email', (req, res) => {

    yourvenues=[];
    app.engine('handlebars', exphbs({ defaultLayout: 'Host' }));
    layout=1;
    flag=0;
    let userRef = db.collection('users');
    let query = userRef.where('Email', '==', req.params.email).get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }
        snapshot.forEach(doc => {
          currentuser=doc.data();

          res.redirect('/Host')
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
 

});

//Chaning Navigation Bar After User logs out
app.get('/changelayouts', (req, res) => {

    normalvenues=[];
    Allvenues=[];
    Featuredvenues=[];
    flag=0;
    app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
    layout=0;
    res.redirect('/')

});

app.post('/search', (req, res) => {

  if (layout == 0) {
    if (req.body.vName == "") {
      search = Allvenues.filter(venue => venue.City.toUpperCase().includes(req.body.vCity.toUpperCase()))

      res.render('search', { venues: search })
    }
    else if (req.body.vCity == "") {
      search = Allvenues.filter(venue => venue.Name.toUpperCase().includes(req.body.vName.toUpperCase()))

      res.render('search', { venues: search })
    }
    else if (req.body.vCity == "" && req.body.vName == "") {

      res.render('search', { venues: Allvenues })

    }
    else {
      search = Allvenues.filter(venue => venue.City.toUpperCase().includes(req.body.vCity.toUpperCase()) && venue.Name.toUpperCase().includes(req.body.vName.toUpperCase()))

      res.render('search', { venues: search })
    }
  }
  //If A user Is Signed Search is restricted to his venues
  else
  {
    if (req.body.vName == "") {
      search = yourvenues.filter(venue => venue.City.toUpperCase().includes(req.body.vCity.toUpperCase()))

      res.render('search', { venues: search })
    }
    else if (req.body.vCity == "") {
      search = yourvenues.filter(venue => venue.Name.toUpperCase().includes(req.body.vName.toUpperCase()))

      res.render('search', { venues: search })
    }
    else if (req.body.vCity == "" && req.body.vName == "") {

      res.render('search', { venues: yourvenues })

    }
    else {

      search = yourvenues.filter(venue => venue.City.toUpperCase().includes(req.body.vCity.toUpperCase()) && venue.Name.toUpperCase().includes(req.body.vName.toUpperCase()))

      res.render('search', { venues: search })
    }
  }
});

//Setting A Venue To be Featured
app.get('/Featured', (req, res) => {

    var x=true;
    let venueRef = db.collection('venue').doc(venue.Name);
    let setWithOptions = venueRef.set({
      Featured: x,
      Expire: moment().add(1, 'Month').format("YYYY-MM-D")
    }, { merge: true });

    res.redirect('/Host')
})

// Payement For Getting Your Venue Featured
app.get('/Fpayment', (req, res) => {

  res.render('Fpayment',{venue})
})


app.get('/selectTheme/:name', (req, res) => {

        
  let ThemesRef = db.collection('venue').doc(req.params.name);
  let getDoc = ThemesRef.get()
    .then(doc => {
      
   
        venue = doc.data();
        
        for (var i = 0, len = venue.Themes.length; i < len; i++) 
        {             
        let ThemeRef = db.collection('themes').doc(venue.Themes[i]);
        let getDoc = ThemeRef.get()
          .then(doc => {
              
              Themes.push(doc.data())  
             if(Themes.length===venue.Themes.length)
             {
                res.redirect('/selectTheme') 
             };

          })     
          .catch(err => {
            console.log('Error getting document', err);
          });
          
        }
        if(venue.Themes.length===0)
        {
           res.redirect('/selectTheme')

        };    
              
        
    })
    .catch(err => {
      console.log('Error getting document', err);
    })
})

app.get('/hostTheme/:name', (req, res) => {

        
  let ThemesRef = db.collection('venue').doc(req.params.name);
  let getDoc = ThemesRef.get()
    .then(doc => {
      
   
        venue = doc.data();
        for (var i = 0, len = venue.Themes.length; i < len; i++) 
        {             
        let ThemeRef = db.collection('themes').doc(venue.Themes[i]);
        let getDoc = ThemeRef.get()
          .then(doc => {
              
              Themes.push(doc.data())  
             if(Themes.length===venue.Themes.length  ||  venue.Themes.length===0)
             {
             
                res.redirect('/hostTheme')


             };

          })     
          .catch(err => {
            console.log('Error getting document', err);
          });
          
        }
        if(venue.Themes.length===0)
        {
           res.redirect('/hostTheme')

        };    
        
    })
    .catch(err => {
      console.log('Error getting document', err);
    })
})

app.get('/selectTheme', (req, res) => {

        res.render('selectTheme',{venue,Themes})
  Themes=[];
});

app.get('/hostTheme', (req, res) => {

  var x= false;
  if(venue.Featured == x)
  {
    res.render('hostTheme',{venue,Themes,Flag: "0"})
  }
  else
  res.render('hostTheme',{venue,Themes})
  Themes=[];
});

//After Theme is selected for a venue this gets the Booking page
app.get('/themeSelected/:name', (req, res) => {

  let ThemeRef = db.collection('themes').doc(req.params.name);
  let getDoc = ThemeRef.get()
    .then(doc => {

      theme = doc.data();
   //   console.log(doc.data());
    })
    .catch(err => {
      console.log('Error getting document', err);
    }).then(doc => {

      console.log(venue.Owner);
      let ThemeRef = db.collection('users').doc(venue.Owner);
      let getDoc = ThemeRef.get()
        .then(doc => {

          user = doc.data();
 
          res.redirect('/themeSelected')
        })
        .catch(err => {
          console.log('Error getting document', err);
        })
    });
});

//Adding theme to user's venues
app.get('/AddTheme/:name', (req, res) => {

  
        console.log(req.params.name)

        if(venue.Themes.length===0)
        {
          let venueRef = db.collection('venue').doc(venue.Name);
          let setWithOptions = venueRef.set({
            Themes: [req.params.name]
          }, { merge: true });
        }
        else
        {
          let venueRef = db.collection('venue').doc(venue.Name);
          let setWithOptions = venueRef.set({
            Themes: [venue.Themes[0], req.params.name]
          }, { merge: true });
        }
        flag=0;
        yourvenues=[];
          res.redirect('/Host')

});

app.get('/themeSelected', (req, res) => {

  res.render('themeSelected',{venue,user,theme})
});

// Booking Page When User Hasn't Selected A Theme
app.get('/withoutTheme', (req, res) => {
  let ThemeRef = db.collection('users').doc(venue.Owner);
  let getDoc = ThemeRef.get()
    .then(doc => {

      user = doc.data();
      res.render('WithoutTheme',{venue,user})
    })
    .catch(err => {
      console.log('Error getting document', err);
    })
  
});

// Payment Page When User didn't Select A Theme
app.post('/PaymentWithoutTheme', (req, res) => {

    Booking = {
      Email: req.body.email,
      Pname: req.body.pname,
      Cname: req.body.cname,
      Phone: req.body.phone,
      Date: req.body.date,
      Price: venue.Price,
      Venue: venue.Name,
      Owner: user.Name
    }
  console.log(Booking)
  res.render('PaymentWithoutTheme',{venue,Booking,user})
});

// Payment Page When User did Selecte A Theme
app.post('/Payment', (req, res) => {

  var Flag=0;
    let BookingRef = db.collection('Booking');
    let query = BookingRef.where('Venue', '==', venue.Name).get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }
        snapshot.forEach(doc => {
          if(doc.data().Date == req.body.date)
          Flag=1;
        })
      }).then(doc =>{
        console.log(user);
        Booking = {
          Email: req.body.email,
          Pname: req.body.pname,
          Cname: req.body.cname,
          Phone: req.body.phone,
          Date: req.body.date,
          Price: venue.Price + theme.Price,
          Venue: venue.Name,
          Theme: theme.Name,
          Owner: user.Name
        }
        //Checking If The Booking Date Has Already Been Booked
        if(Flag==1)
        {
        res.render("themeSelected",{venue,user,theme,Flag: "0"})
        }
        else
          res.render('payment',{venue,Booking,user})
     })

    
    
});

  //Final Processing of Payment And Booking with Theme Selected
app.get('/final', (req, res) => {

  var id=uuid.v4();
    let docRef = db.collection('Booking').doc(id);
  let setAda = docRef.set({
      ID:   id,
      Email: Booking.Email,
       Pname: Booking.Pname,
        Cname: Booking.Cname,
        Phone: Booking.Phone,
       Date:  Booking.Date,
        Price: Booking.Price,
       Venue: Booking.Venue,
        Theme: Booking.Theme,
        Owner: Booking.Owner
  })
  res.redirect('/')
});

 //Final Processing of Payment And Booking without Theme Selected
app.get('/finalwithouttheme', (req, res) => {

  console.log("as")
  var id=uuid.v4();
    let docRef = db.collection('Booking').doc(id);
  let setAda = docRef.set({
      ID:   id,
      Email: Booking.Email,
       Pname: Booking.Pname,
        Cname: Booking.Cname,
        Phone: Booking.Phone,
       Date:  Booking.Date,
        Price: Booking.Price,
       Venue: Booking.Venue,
        Owner: Booking.Owner
  })
  res.redirect('/')
});


//Routes For Authentication
app.use('/', require('./routes/Authentication'))




//Creating A new Venue
app.post('/Host',(req,res)=>{

  var s="images/"+req.body.myFile;
  let docRef = db.collection('venue').doc(req.body.Name);
  let setAda = docRef.set({
      Name: req.body.Name,
      Price: req.body.Price,
      Address: req.body.Address,
      City: req.body.City,
      Image: s,
      Owner: currentuser.Name,
      Expire: "",
      Featured: false,
      Themes: []
  });

  res.redirect('/Host');

});


app.get('/DeleteTheme/:name', (req, res) => {

  var temp=[];
  temp= venue.Themes;
  temp.splice( temp.indexOf('req.params.body'), 1 );
  let venueRef = db.collection('venue').doc(venue.Name);
  let setWithOptions = venueRef.set({
      Themes: temp
      }, {merge: true});
          res.redirect('/Host')
      
 });

 // Showing Themes not selected by the user for a venue in order to add them
 app.get('/Themes/:name', (req, res) => {

  console.log(venue)
  Themes=[];
  if (venue.Themes.length == 0) {
    let venueRef = db.collection('themes');
    let Allvenueref = venueRef.get()
      .then(snapshot => {
        snapshot.forEach(doc => {

          Themes.push(doc.data())

        });
      }).then(function () {
        res.redirect('/AddThemes')
      }
      )
      .catch(err => {
        console.log('Error getting documents', err);
      });

  }
  else {

      //For Loop not used As the Array is of only Two Elements Which are handled differently to each other
      let venueRef = db.collection('themes');
      let Allvenueref = venueRef.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          
         if(venue.Themes.length ==1)
         {
          if (doc.data().Name.includes( venue.Themes[0])) {
        
          }
          else
          {
            Themes.push(doc.data())
          }
        }
            res.redirect('/AddThemes')

        });
      }).catch(err => {
        console.log('Error getting documents', err);
      });

  }

});
// Add Themes Page For Venues
app.get('/AddThemes', (req, res) => {

  res.render('AddThemes', {Themes,venue})
  Themes=[];
});

// Show All Boking of All user venues
app.get('/Bookings', (req, res) => {
  Bookings = [];
  console.log(currentuser);
  let BookingRef = db.collection('Booking');
  let query = BookingRef.where('Owner', '==', currentuser.Name).get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }

      snapshot.forEach(doc => {
        Bookings.push(doc.data());
       // console.log(Bookings);
      });
    }).then(function () {

      res.render('BookedParties', { Bookings })
      // res.render('BookedParties')
    }
    )
    .catch(err => {
      console.log('Error getting documents', err);
    });

});


//static folder to Use Images and Tools
app.use(express.static(path.join(__dirname, 'views')));

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log("server started on Port 1000"));


//Variables used all automatically populated from data base when need in each event
var flag = 0;
var search=[];
var venue = {};
var Themes=[];
var theme={};
var user={};
var layout=0;
var currentuser={};
var Booking={};
var normalvenues=[];
var Featuredvenues=[];
var yourvenues=[];
var Allvenues = [];
var Bookings=[];
