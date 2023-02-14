const { parseString } = require("xml2js");
var XMLHttpRequest = require('xhr2');

const getFedexRates = (address, cart) => {
  return new Promise((resolve, reject) => {
    fedexAuthenticate().then((response) => {
      var input = {
        "accountNumber": {
          "value": "740561073"
        },
        "requestedShipment": {
          "shipper": {
            "address": {
              "streetLines": [
                "`19 Cottonwood Drive`"
              ],
              "city": "Belleville",
              "stateOrProvinceCode": "ON",
              "postalCode": "K8N0J3",
              "countryCode": "CA",
              "residential": true
            }
          },
          "recipient": {
            "address": {
              "streetLines": [
                address.street,
                address.unit
              ],
              "city": address.city,
              "stateOrProvinceCode": address.provinceCode,
              "postalCode": address.postal,
              "countryCode": address.countryCode,
              "residential": true
            }
          },
          "rateRequestType": [
            "PREFERRED"
          ],
          "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
          "preferredCurrency": "CAD",
          "requestedPackageLineItems": [
            {
              "weight": {
                "units": "KG",
                "value": cart.totalWeight
              }
            }
          ]
        }
      }
      var data = JSON.stringify(input);
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function (event) {
        if (this.readyState === 4) {
          const rates = JSON.parse(this.responseText);
          const formatedRates = [];
          rates.output.rateReplyDetails.map((rate) => {
            rate.ratedShipmentDetails.map((details) => {
              if (details.currency !== 'CAD') {
                return;
              }
              const formated = {
                shipper: 'Fedex',
                service: rate.serviceName,
                code: rate.serviceType,
                cost: details.totalNetCharge,
                currenyCode: details.currency
              }
              formatedRates.push(formated);
            });
          });
          resolve(formatedRates);
        }
      });

      xhr.open("POST", "https://apis-sandbox.fedex.com/rate/v1/rates/quotes");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("X-locale", "en_US");
      xhr.setRequestHeader("Authorization", `Bearer ${response.access_token}`);

      xhr.send(data);
    });


  })
}
exports.getFedexRates = getFedexRates;

const fedexAuthenticate = () => {
  return new Promise((resolve, reject) => {
    var data = 'grant_type=client_credentials&client_id=l7dd55cd72ceae4808838f30aaec72afb1&client_secret=23d9607f55234dd984401732500a8436';

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        resolve(JSON.parse(this.responseText));
      }
    });

    xhr.open("POST", "https://apis-sandbox.fedex.com/oauth/token");
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
  })
}
exports.auth = fedexAuthenticate;
const getCanadaPostRates = (postal, country, weight) => {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(process.env.CANADAPOST_AUTH).toString("base64");
    var request = require("request");
    request.post({
      url: 'https://ct.soa-gw.canadapost.ca/rs/ship/price',
      headers: {
        'Accept': 'application/vnd.cpc.ship.rate-v4+xml',
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/vnd.cpc.ship.rate-v4+xml',
        'Accept-language': 'en-CA'
      },
      body: getXMLmailBody(postal, country, weight)
    }, function (error, response, body) {
      if (error) { reject(error); }
      var xmldata = response.body;
      parseString(xmldata, function (err, results) {
        if (err) {
          console.log(err);
          reject(err);
        }
        try {
          const rates = JSON.parse(JSON.stringify(results));
          const formatedRates = [];
          rates["price-quotes"]["price-quote"].map((rate) => {
            const formated = {
              shipper: 'CanadaPost',
              service: rate['service-name'][0],
              code: rate['service-code'][0],
              cost: rate['price-details'][0]['due'][0],
              currenyCode: 'CAD'
            }
            formatedRates.push(formated);
          });
          resolve(formatedRates);
        } catch (error) {
          reject(error);
        }
      });
    });
  });
}

function getXMLmailBody(postal, country, weight) {
  if (country === "Canada") {
    const canadaBody = '<?xml version="1.0" encoding="utf-8"?><mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">' +
      '<customer-number>0009710618</customer-number>' +
      '<parcel-characteristics>' +
      '<weight>' + weight + '</weight>' +
      '</parcel-characteristics>' +
      '<origin-postal-code>K8N0J3</origin-postal-code>' +
      '<destination>' +
      '<domestic>' +
      '<postal-code>' + postal + '</postal-code>' +
      '</domestic>' +
      '</destination>' +
      '</mailing-scenario>';
    return canadaBody
  } else {
    const UBody = '<?xml version="1.0" encoding="utf-8"?><mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">' +
      '<customer-number>0009710618</customer-number>' +
      '<parcel-characteristics>' +
      '<weight>' + weight + '</weight>' +
      '</parcel-characteristics>' +
      '<origin-postal-code>K8N0J3</origin-postal-code>' +
      '<destination>' +
      '<united-states>' +
      '<zip-code>' + postal + '</zip-code>' +
      '</united-states>' +
      '</destination>' +
      '</mailing-scenario>';
    return UBody;
  }
}

const calculateShipping = (address, cart) => {
  return new Promise(async (resolve, reject) => {
    if (cart.totalWeight === 0) {
      resolve([{
        shipper: 'SPFA Promo',
        service: 'Free Shipping',
        code: 'free',
        cost: 0,
        currenyCode: 'CAD'
      }]);
      return;
    }
    const canadaPost = await getCanadaPostRates(address.postal, address.country, cart.totalWeight).then((rates) => {
      return rates;
    }).catch((error) => {
      return [];
    });
    const fedex = await getFedexRates(address, cart).then((rates) => {
      return rates;
    }).catch((error) => {
      return [];
    });
    const allRates = [...canadaPost, ...fedex];
    resolve(allRates);
  });
}

exports.calculateShipping = calculateShipping;

