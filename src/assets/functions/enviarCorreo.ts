import * as nodemailer from 'nodemailer';

export const enviarCorreo = async (email:string, template:string, tipoVenta:string = "Resumen de venta") => { 

    let transporter:any = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "eg.miloti@gmail.com", // generated ethereal user
            pass: "rnca lhsu pvvr bznq", // generated ethereal password
        },
    });

    await transporter.sendMail({
        from: '"AddidSport" <renato@pruebasdecorreo.com>', // sender address
        to: email, // list of receivers
        subject: tipoVenta, // Subject line (asunto)
        // text: "Hello world?", // plain text body
        html: template, // html body
    });

}