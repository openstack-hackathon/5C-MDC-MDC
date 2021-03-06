var mysql = require("mysql");

function REST_ROUTER(router, pool, md5) {
  var self = this;
  self.handleRoutes(router, pool, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, pool, md5) {
  
  router.get('/getConsultorios/:nelat/:nelng/:swlat/:swlng', function(req, res) {
    console.log('[SERVICE] - Get consultorios. ');
    var northeastlat = req.params.nelat;
    var northeastlng = req.params.nelng;
    var southwestlat = req.params.swlat;
    var southwestlng = req.params.swlng;
    var idConsultorios = 4;
    var query = 'SELECT loc.Latitude, loc.Longitude, us.Name, us.idUser FROM ' +
                '  Location loc ' +
                'JOIN ' +
                '  User us ' +
                'ON ' +
                '  us.idUser = loc.idUser ' +
                'JOIN ' +
                '  RoleUser ru ' +
                'ON ' +
                '  us.idUser = ru.idUser ' +
                'WHERE ' +
                '  (loc.Latitude <= ? ' + //north
                'AND ' +
                '  loc.Latitude >= ?) ' + //south
                'AND ' +
                '  (loc.Longitude <= ? ' + //north
                'AND ' +
                '  loc.Longitude >= ?) ' +//south
                'AND ' +
                '  ru.idRoles = ?';
    
    var coords = [northeastlat, southwestlat, northeastlng, southwestlng,idConsultorios];
    var query = mysql.format(query, coords);
    
    console.log(query);
    
    pool.getConnection(function(err, connection){
      if(err) {
        console.error(err);
        res.statusCode = 500;
        res.json({
          "Error": true,
          "Message": "DB connection error. " + err
        });
        return;
      }
      connection.query(query, function(err, result){
        connection.release();
        if(err) {
          console.error(err);
          res.statusCode = 500;
          res.json({
            "Error": true,
            "Message": "DB connection error. " + err
          });
          return
        }
        console.log("Query execution successful.");
        res.json({
          "Error": false,
          "Message": "OK",
          "Results": result
        });
      })
    });
                
  });
  
}
  
module.exports = REST_ROUTER;