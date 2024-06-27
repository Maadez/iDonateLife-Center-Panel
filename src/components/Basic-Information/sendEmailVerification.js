import emailjs from 'emailjs-com';
import { firestore } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const sendEmailVerification = async (centerData) => {
  const service_id = 'service_e476cub';
  const template_id = 'template_f20p2jy';
  const user_id = 'e4J8zlv-_JpuywtGI';

  // Generate a unique verification token
  const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // Save the verification token to Firestore
  const centerDocRef = doc(firestore, 'centers', centerData.centerId);
  await updateDoc(centerDocRef, {
    verificationToken: verificationToken,
  });

  // Create the verification link
  const verificationLink = `http://localhost:5173/verify-center?token=${verificationToken}&centerId=${centerData.centerId}`;

  const templateParams = {
    to_name: 'idonatelife1@gmail.com',
    from_name: centerData.centerName,
    message: `New center information submitted:
              Center Name: ${centerData.centerName}
              Center Phone: ${centerData.centerPhone}
              Opening Time: ${centerData.openingTime}
              Closing Time: ${centerData.closingTime}
              Center Address: ${centerData.centerAddress}`,
    verificationLink: verificationLink
  };

  try {
    const response = await emailjs.send(service_id, template_id, templateParams, user_id);
    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmailVerification;