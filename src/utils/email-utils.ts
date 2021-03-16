import * as Mailer from "nodemailer";
export const sendMail=async(receiverEmail:string,subject:string,textBody:string,htmlBody:string)=>{
  const mailTransporter= Mailer.createTransport({
    host: 'localhost',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "donotreply@smart-doc.co.uk", // generated ethereal user
      pass: `vCO*bD)zRdRH`, // generated ethereal password
    },
    tls:{
        rejectUnauthorized:false
    }
  }); 


  let htmlBodyTemplate = `
  <html>
  <body>
      <section class="login_inner" style="font-family: 'Poppins', sans-serif !important;margin-bottom: 15px;">
         <div class="container">
            <div class="row">
               <div class="email" style="padding: 15px; margin: 0 auto; max-width: 500px; background: #f9f9f9; max-width: 500px; text-align: center; width: 100%;">
               <div class="logo" style="text-align: left; width:30%;display: inline-block;">
               <img src="https://smart-doc.co.uk/images/smart-choice-formation/logo.png" width="100%">
           </div>
               <div class="text_rt" style="text-align: right;display: inline-block; width:60%;padding: 0 0 0 40px;">
               <p style="font-size: 13px;">Need help? <a href="https://www.smart-formations.co.uk/contact-us/">Contact Us</a></p>
           </div>
                <div class="mail_body" style="text-align: left; font-size: 13px;">
                    <div class="name_heading text-left" style="text-align: left; font-size: 15px; font-weight: 500; ">
                       
                    </div>
                    <p> ${textBody}</p>
                        <a href="#" class="actve">
                        <!--<button type="submit" class="" style="background: #25a9e0; width: 150px; padding: 10px; color: #fff;margin: 15px 0;border: 1px solid #fff;">Activate Account</button> -->
                        </a>
                    
                   
                </div>
                   <!-- <p class="ft" style="text-align: left; font-size: 13px;">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> -->
                </div>
            </div>
         </div>
      </section>
      <footer class="app-footer log_foot" style="text-align: center; padding: 5px 0;font-family: 'Poppins', sans-serif !important; font-size: 12px;">
         <div>
            <a href="javascript:void(0)" style="text-decoration: none;">Smart Docustore Ltd .
            </a>
            <span>© 2021 .</span>
         </div>
         <div class="termbox" style="text-decoration: none;">
            <a href="#" style="text-decoration: none;">Term and Conditions</a>
            <a href="#" style="text-decoration: none;">Privacy Policy</a>
         </div>
      </footer>
      <!--js-->

   </body>
   </html>
  `;
  
    let response = await mailTransporter.sendMail({
      from: 'donotreply@smart-doc.co.uk', // sender address
      to: receiverEmail, // list of receivers
      subject: subject, // Subject line
      text: "", // plain text body
      html: htmlBodyTemplate, // html body
    });
}
