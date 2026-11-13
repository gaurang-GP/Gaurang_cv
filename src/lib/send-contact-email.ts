import emailjs from "@emailjs/browser";

import { profile } from "@/components/portfolio/data";

export type ContactFormPayload = {
  name: string;
  email: string;
  message: string;
};

function readEmailJsConfig() {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
  const receiverTemplateId =
    (import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RECEIVER as string | undefined) ||
    (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined);
  const senderTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_SENDER as string | undefined;
  return { publicKey, serviceId, receiverTemplateId, senderTemplateId };
}

export function isEmailJsConfigured(): boolean {
  const { publicKey, serviceId, receiverTemplateId } = readEmailJsConfig();
  return Boolean(publicKey?.trim() && serviceId?.trim() && receiverTemplateId?.trim());
}

function buildTemplateParams(payload: ContactFormPayload) {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  return {
    from_name: payload.name,
    from_email: payload.email,
    reply_to: payload.email,
    to_email: payload.email,
    message: payload.message,
    to_name: profile.name,
    owner_name: profile.name,
    owner_email: profile.email,
    owner_phone: profile.phone,
    site_url: siteUrl,
  };
}

/**
 * Sends receiver notification + optional visitor auto-reply via EmailJS.
 * See email-templates/ for HTML for both templates.
 */
export async function sendContactEmail(payload: ContactFormPayload): Promise<void> {
  const { publicKey, serviceId, receiverTemplateId, senderTemplateId } = readEmailJsConfig();
  if (!publicKey || !serviceId || !receiverTemplateId) {
    throw new Error(
      "Email is not configured yet. Add VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, and VITE_EMAILJS_TEMPLATE_ID_RECEIVER.",
    );
  }

  const params = buildTemplateParams(payload);
  const opts = { publicKey };

  await emailjs.send(serviceId, receiverTemplateId, params, opts);

  if (senderTemplateId?.trim()) {
    await emailjs.send(serviceId, senderTemplateId, params, opts);
  }
}
