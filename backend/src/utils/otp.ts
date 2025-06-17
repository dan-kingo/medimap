import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromPhone = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

// Simple in-memory store for dev (consider Redis for prod)
const otpStore = new Map<string, string>();

export const sendOtp = async (phone: string): Promise<boolean> => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(phone, otp); // store OTP temporarily (e.g., for 5–10 min)

  await client.messages.create({
    body: `Your MediMap OTP is: ${otp}`,
    from: fromPhone,
    to: phone,
  });

  return true;
};

export const verifyOtp = (phone: string, otp: string): boolean => {
  const stored = otpStore.get(phone);
  return stored === otp;
};
