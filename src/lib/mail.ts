import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

    try {
        await resend.emails.send({
            from: 'THF AI Hub <onboarding@resend.dev>', // Update this after user provides their verified domain
            to: email,
            subject: 'Verify your email - THF AI Hub',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
                    <h1 style="color: #1e293b; font-size: 24px; font-weight: 800; text-align: center; font-style: italic;">
                        THF AI <span style="color: #2563eb;">Hub</span>
                    </h1>
                    <p style="color: #475569; font-size: 16px; line-height: 24px; margin-top: 24px;">
                        Welcome to THF AI Hub! To start using our tools and credits, please verify your email address by clicking the button below:
                    </p>
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="${confirmLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
                            Verify Email Address
                        </a>
                    </div>
                    <p style="color: #64748b; font-size: 12px; margin-top: 32px; text-align: center;">
                        If you didn't create an account, you can safely ignore this email.
                    </p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                    <p style="color: #94a3b8; font-size: 11px; text-align: center; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 900;">
                        Developed by thfnexus
                    </p>
                </div>
            `
        });
        return { success: true };
    } catch (error) {
        console.error("Resend Error:", error);
        return { success: false, error };
    }
};
