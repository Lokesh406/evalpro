# EmailJS Setup Guide - Get Emails Working! ✉️

Follow these steps to enable real email sending in EvalPro:

## Step 1: Create EmailJS Account
1. Go to **[emailjs.com](https://emailjs.com)** 
2. Click **"Sign Up"** (completely free)
3. Use your Gmail account or email to register

## Step 2: Add Email Service
1. After login, go to **Email Services** (left sidebar)
2. Click **"Add Service"**
3. Choose **Gmail** (or your email provider)
4. Follow the steps to connect your Gmail account
5. Note your **Service ID** (looks like `service_xxxxx`)

## Step 3: Create Email Template
1. Go to **Email Templates** (left sidebar)
2. Click **"Create New Template"**
3. Set template name to `assessment_report`
4. Copy this template content into the editor:

```
From: {{from_email}} (EvalPro System)
To: {{to_email}}

Subject: Assessment Report - {{student_name}}

Hello {{to_name}},

Your assessment report has been generated!

Student: {{student_name}}
Registration: {{reg_no}}
Report Date: {{report_date}}
Overall Average: {{overall_average}}/60

Subject Breakdown:
{{subjects_report}}

For detailed PDF view, download the full report.

Best regards,
EvalPro Assessment System
```

4. Click **"Save"**
5. Note your **Template ID** (looks like `template_xxxxx`)

## Step 4: Get Your Public Key
1. Go to **Account** tab (top right)
2. Click **"API Keys"**
3. Copy your **Public Key** (looks like `xxxxx_xxxxxxx`)

## Step 5: Update the Code
Open `src/components/EmailExportModal.jsx` and replace:

- Line ~125: `emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");` 
  - Replace with: `emailjs.init("YOUR_PUBLIC_KEY_HERE");`

- Line ~170: `service_DEFAULT` 
  - Replace with: `"service_YOUR_SERVICE_ID"`

- Line ~171: `template_DEFAULT` 
  - Replace with: `"template_YOUR_TEMPLATE_ID"`

### Example:
```javascript
emailjs.init("1234567890abcdef");  // Your public key

// Later in code:
const result = await emailjs.send(
  "service_abc123xyz",      // Your service ID
  "template_report789",     // Your template ID
  emailParams
);
```

## Step 6: Test It!
1. Save the file
2. Reload the app at `http://localhost:5173/evalpro/`
3. Add student marks
4. Click **"Email"** button
5. Enter an email address
6. Click **"Send Email"**
7. Check your inbox! ✅

## Troubleshooting

**"Email not arriving?"**
- Make sure Service ID and Template ID are correct (copy-paste from EmailJS)
- Check spam folder
- Verify your Gmail is connected in EmailJS Email Services

**"Error: not initialized?"**
- Your Public Key is wrong
- Go to Account → API Keys and copy the exact key

**"Rate limit exceeded?"**
- EmailJS free plan has limits (50 emails/day)
- Upgrade plan on emailjs.com if needed

## Free Plan Limits
- **50 emails/day** (free tier)
- Emails sent from your configured Gmail account
- Support for up to 2 email services

---

✅ Once setup is complete, every email sent will actually arrive in the recipient's inbox!
