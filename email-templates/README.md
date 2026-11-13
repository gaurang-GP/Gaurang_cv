# EmailJS contact templates (2 templates)

Create **two** templates in the EmailJS dashboard. The app sends both on every form submit.

## 1. Receiver (you)

| Setting | Value |
|--------|--------|
| **Name** | Portfolio – Contact (Receiver) |
| **Subject** | `New portfolio message from {{from_name}}` |
| **To** | `gaurangp830@gmail.com` |
| **Reply-To** | `{{reply_to}}` |
| **HTML** | Paste `contact-receiver.html` |
| **Text** | Paste `contact-receiver.txt` (optional) |

**Env:** `VITE_EMAILJS_TEMPLATE_ID_RECEIVER`

Variables: `{{to_name}}` `{{from_name}}` `{{from_email}}` `{{reply_to}}` `{{message}}` `{{site_url}}`

---

## 2. Sender (visitor auto-reply)

| Setting | Value |
|--------|--------|
| **Name** | Portfolio – Contact (Auto-reply) |
| **Subject** | `Thanks for contacting {{owner_name}}, {{from_name}}!` |
| **To** | `{{to_email}}` ← dynamic (visitor’s email) |
| **Reply-To** | `{{owner_email}}` |
| **HTML** | Paste `contact-sender.html` |
| **Text** | Paste `contact-sender.txt` (optional) |

**Env:** `VITE_EMAILJS_TEMPLATE_ID_SENDER`

Variables: `{{to_email}}` `{{from_name}}` `{{message}}` `{{site_url}}` `{{owner_name}}` `{{owner_email}}` `{{owner_phone}}`

---

## `.env` example

```
VITE_EMAILJS_PUBLIC_KEY=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID_RECEIVER=template_xxxxx
VITE_EMAILJS_TEMPLATE_ID_SENDER=template_yyyyy
```

Legacy `VITE_EMAILJS_TEMPLATE_ID` is still accepted as the receiver template only (no auto-reply).
