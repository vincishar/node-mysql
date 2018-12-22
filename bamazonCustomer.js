const mysql = require('mysql');
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "bamazon",
    insecureAuth: true,
  });

con.connect(function(err) {
  if (err) throw err;
  // console.log("Connected!");
  rl.question('Enter ID of product you would like to buy: ', function(itemId) {
    rl.question('Enter how many units of the product you would like to buy: ', function(units) {
      con.query("SELECT * FROM products WHERE item_id=" + itemId, function(qErr, res) {
        if (qErr) { 
          console.log("Failed to process transaction. Please try again. ", qErr)
          process.exit(0)
        }
        if (res.length < 1) {
          console.log("Sorry, product " + itemId + " not found.");
          process.exit(0)
        }
        const qty = res[0].stock_quantity
        if (qty < units) {
          console.log("Sorry, Insufficient quantity for " + res[0].product_name)
          process.exit(0)
        }
        const newQty = qty - units
        con.query("UPDATE products SET stock_quantity=" + newQty + " WHERE item_id=" + itemId, (uErr) => {
          if (uErr) {
            console.log("Failed to process transaction. Please try again. ", uErr)
            process.exit(0)
          }
          console.log("Transaction successful. Total Cost: ", (res[0].price * units))
          process.exit(0)
        })
      })
    })
  })
});

  /*
  Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.


The app should then prompt users with two messages.

The first should ask them the ID of the product they would like to buy.
The second message should ask how many units of the product they would like to buy.



Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.



However, if your store does have enough of the product, you should fulfill the customer's order.

This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, show the customer the total cost of their purchase.
  */