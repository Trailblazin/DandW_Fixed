module.exports = function(app) 
{
 const {check, validationResult} = require('express-validator');
 const redirectLogin = (req,res,next) =>{

 if (!req.session.userID){
 res.redirect('./login')
 }
 else{
 next();
 }
 }
const isAdmin = (req,res,next) =>{
	let isAdmin = false 
	if(req.session.userID=="BlazinAdmin")
	{
	next();
	}
	else{
	res.send('Admin Access Required for this page. <a href'+'./'+'>Back To Home</a>');
	}
}
 app.get('/',function(req,res){
 res.render('index.html')
  });      
 app.get('/about',function(req,res){        
  res.render('about.html'); 
   });     

   app.get('/search',redirectLogin,function(req,res){ 
   res.render("search.html");
   });

   app.get('/search-result', function (req, res){
   let searchResultQuery = "SELECT * FROM Customer WHERE name LIKE ?";
   db.query(searchResultQuery,req.query.keyword,(err,result) =>{
   if (err){
    console.log(err)
   }
   res.send('Keyword Entry:'+ req.query.keyword + 'Search Result:' + result);
   });

  app.get('/list',redirectLogin, function(req,res) {
      let sqlQuery =  "SELECT * FROM Customer"; //gets customers from DB
      //run sql query
      db.query(sqlQuery, (err, result) => {
      if (err) {
         res.redirect('./');
         }
         res.render('list.ejs',{avaliableCustomers: result});
         });
         });

  app.get('/listUsers',redirectLogin, function(req,res) {
     let sqlQuery =  "SELECT * FROM User"; //gets Users from DB       
     //run sql query      
     db.query(sqlQuery, (err, result) => { 
     if (err) {
	 res.redirect('./');
     }         
     res.render('listUsers.ejs',{avaliableUsers: result});
     }); 
  });

  app.get('/addCustomer',redirectLogin,function(req,res){
  res.render("addCustomer.html");
  });

  app.post('/customerAdded', function(req,res){
      //save data to database
      let sqlQuery = "INSERT INTO Customer (name, address,property_id,property_price) VALUES (?,?,?,?)";
      //execute query
      const newRecord = [req.body.name, req.body.address,req.body.proprty_id,req.body.property_price];
      db.query(sqlQuery, newRecord, (err,result) => {
       if (err) {
        return console.error(err.message);
       }
       else 
       res.send('This customer is added to database, name: '+ req.body.name +' address '+ req.body.address);
       });
 });
 app.get('/addClaim', redirectLogin,function(req,res){
	 res.render("addCustomer.html");
 });
 app.post('/claimAdded', function(req,res){

	//save data to database
      let sqlQuery = "INSERT INTO Claim (year, customer_id,damage_amount,damage_type) VALUES (?,?,?,?)";
		  //exec
	 const newRecord = [req.body.year, req.body.id,req.body.damage_amount,req.body.damage_type]
	 db.query(sqlQuery, newRecord, (err,result) => {	        
		 if (err) {
	          return  console.error(err.message);
		}
	else
	res.send('This claim is added to database, ID: '+ req.body.id +'Issue of Claim:'+ req.body.damage_type);
                                   });
   });

app.get('/editClaim', isAdmin,function(req,res){
	res.render("editClaim.html");
});
app.post('/claimToEdit', function(req,res){
	let idToQuery = "SELECT customer_id FROM Claim WHERE customer_id=?";
	const id = req.id
	db.query(idToQuery, id, (err,result) =>
	{
	if (err){
	return console.error(err.message);
	}
	let sqlQuery= "UPDATE Claim SET (year, damage_type,damage_amount) VALUES(?,?,?) WHERE customer_id = ?"
	const recordEdit = [req.body.year,req.body.type,req.body.damage,req.body.id]
        db.query(sqlQuery,recordEdit,(err,result) =>
	{
	if (err){
	return console.error(err.message);
	}
	else
	res.send('Claim:' + req.body.id+ "has been amended successfully");
	});
	});
	
});

app.get('/removeClaim',isAdmin, function(req,res){
	res.render("removeClaim.html");
});
app.post('/claimRemove',function(req,res){
  let sqlQuery = "DELETE FROM Claim WHERE customer_id=?";
	//run query
 db.query(sqlQuery, (err,result)=>{
	 if(err){
		res.redirect('./logout')
	 }
	 else
	 res.send('Claim has been removed from the database! <a href='+'./'+'>Return Home</a>');
	});
});
  app.get('/register', function(req,res){
  res.render("register.html");
  });

  app.post('/registerSuccess',[check('password').isLength({min:6, max:100}).isStrongPassword()], function(req,res){
	//save Registered user to User Table
	const errors = validationResult(req);
	 if (!errors.isEmpty())
	 {
	 res.redirect('./register');
	}
	const cleanUser = req.sanatize(req.body.username);
	const cleanPass = req.sanatize(req.body.password);
 	let regQuery = "INSERT INTO User (username,hashedPassword) VALUES (?,?)";
	//Hash body password (plainText) before adding to database
	bcrypt.hash(cleanPass,10, function(err, hassPass){
	if (err)
	{
	  console.log(err);
	}
        //execute Create User query using hashedPassword
	const newUser = [cleanUser, hashPass];
	db.query(regQuery, newUser, (err,result) => {
	if (err){
	return console.error(err.message);
	}
	else
	//Res will send sanatized username and password
	res.send('User:' + cleanUser+ ' is now registered with pass:' + cleanPass);
	});
  });
  });

  app.get('/login', function(req,res){
	  res.render("login.html.");
  });
  
   app.post('/loginSuccess', function(req,res){
	   //Get Hashed Password by Username       
	   let loginQuery = "SELECT hashedPassword FROM User WHERE username = ?";
	   db.query(loginQuery, req.body.username, (err,hashedPass) => {        
	   if (err){
	   return console.error(err.message);
	   }        
	//Get if HashedPassed is for correct user        
	bcrypt.compare(req.body.password,hashedPass, function(err, userValid){
	if (err)        
	{          
	console.log(err);
	} 	
	if (userValid == true) 	
	{ 
	req.session.userID = req.body.username;
	res.send('User:' + req.body.username + 'has logged in successfully!');
	}
	else 
	{ 
	res.send('User verification was unsuccessful!'); 
	}
	}); 	
     });  
   });
   app.get('/logout',redirectLogin,(req,res)=>{
	   req.session.destroy(err => { 
	   if(err){
		   return res.redirect('./')
		  }
	 res.send('You have logged out successfully. <a href='+'./'+'>Home</a>');
	});
   })
  app.get('/api',function(req,res){
  let sqlQuery =  "SELECT * FROM Customer"; 
  //run sql query  
  db.query(sqlQuery, (err, result) => {
  if (err) {  
  res.redirect('./'); 
  }  
  res.json(result);
  });         
  });
})
}





