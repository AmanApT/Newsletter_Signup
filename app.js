const express = require("express");
const app = express();
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
app.use(express.urlencoded());
app.use(express.static(__dirname));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

//  audience id or list id:  1879656ee6
//  .......(hidden)38497a0ff496561f8f6bc6b-us21

client.setConfig({
  apiKey: ".......(hidden)38497a0ff496561f8f6bc6b-us21",
  server: "us21",
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  const run = async () => {
    try {
      const response = await client.lists.addListMember("1879656ee6", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  };

  run();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
