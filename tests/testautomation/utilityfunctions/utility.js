var Pageobj = require("../objectrepository/objectrepository.json");
var TCname;
var ObjData;
module.exports = {
    getDataParam: function (browser, data) {
        for (var key in data) {
            //console.log(process.argv[4]);
            if (process.argv[4] == key) {
         
          var TCData = (data[key]);
          
              return  TCData;
              
         
      }
    }
  }

 

// InvalidLogin:function(browser) {
//   	console.log(browser.TCname);
//
// browser
//
//   .end();
//   }
};
