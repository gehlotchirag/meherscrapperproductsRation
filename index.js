var Xray = require('x-ray');

var http = require('http');
var fs = require('fs');

Xray('http://shopration.com/HOUSEHOLD-Items?page=1')
    .select([{
      $root: '.item',
      name: '.name',
      amount: '.price-old',
      cost: '.price',
      discountedPrice: '.price-new',
      img: 'img[src]'
    }])
    .format(function(obj) {
      //console.log(obj.name + obj.discountedPrice+"******"+obj.amount);
      obj.name=obj.name.trim();
      if (obj.amount)
      obj.amount=obj.amount.trim();

      if (obj.amount){
        obj.price = parseInt(obj.amount.substring(3));
      }
      else if (obj.discountedPrice) {
        obj.price = parseInt(obj.discountedPrice.substring(3));
      }
      else
      {
        var cost = obj.cost.trim();
        obj.price=parseInt(cost.substring(3));
      }

      obj.quantity = 1;
      if (obj.img) {
        var fileName = obj.img.split('/')[7];
        var file = fs.createWriteStream("household/" + fileName);
        var request = http.get(obj.img, function (response) {
          response.pipe(file);
        });
        obj.ImgFileName = fileName;
      }
      if(obj.img)
        delete obj.img;
      if (obj.amount)
      delete obj.amount;
      if (obj.cost)
        delete obj.cost;
      if (obj.discountedPrice)
        delete obj.discountedPrice;
      return obj;
    })
    .paginate('.links a:nth-last-of-type(2)[href]')
    .limit(10)
    .delay(5000)
    .write('house-hold.json')
    .on('close', function() {
      console.log('all done');
    });
