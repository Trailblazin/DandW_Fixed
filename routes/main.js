module.exports = function(app) 
{     
 app.get('/',function(req,res){
 res.render('index.html')
  });      
 app.get('/about',function(req,res){        
  res.render('about.html'); 
   });     

   app.get('/search',function(req,res){ 
   res.render("search.html");
   });

   app.get('/search-result', function (req, res){
   res.send('Keyword Entry:'+ req.query.keyword + 'Search Result:');
   });

  app.get('/list', function(req,res) {
      let sqlQuery =  "SELECT * FROM Customer"; //gets customers from DB
      //run sql query
      db.query(sqlQuery, (err, result) => {
      if (err) {
         res.redirect('./');
         }
         res.render('list.ejs',{avaliableCustomers: result});
         });
         });

  app.get('/addCustomer',function(req,res){
  res.render("addCustomer.html");
  });

  app.post('/customerAdded', function(req,res){
      //save data to database
      let sqlQuery = "INSERT INTO Customer (name, address) VALUES (?,?)";
      //execute query
      let newRecord = [req.body.name, req.body.address];
      db.query(sqlQuery, newRecord, (err,result) => {
       if (err) {
        return console.error(err.message);
       }
       else 
       res.send('This customer is added to database, name: '+ req.body.name +' address '+ req.body.address);
       });
 });
}






