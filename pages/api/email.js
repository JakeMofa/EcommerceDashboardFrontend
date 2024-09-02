const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { brand, email, title, description } = req.body;

    const msg = {
      to: "no-reply@vendocommerce.com",
      from: "noreply@velocityportal.com",
      subject: "Customer Support",
      html: `<div><h4>Brand: ${brand}</h4><h4>Email: ${email}</h4><h4>Title: ${title}</h4><p>Description: ${description}</p></div>`,
    };

    await sgMail
      .send(msg)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  res.status(200).json({ success: true });
}
