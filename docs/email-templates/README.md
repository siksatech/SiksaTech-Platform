# SiksaTech Supabase Email Configuration & Template Guide

This directory contains branded, responsive HTML email templates configured with **`support@siksatech.in`** for Supabase Auth.

---

## 1. Supabase SMTP & Sender Setup

In your **Supabase Dashboard**:
1. Go to **Authentication** &rarr; **Email Settings** (or **SMTP Settings**).
2. Set **Sender Email**: `support@siksatech.in`
3. Set **Sender Name**: `SiksaTech` (or `SiksaTech Support`)
4. Enter your custom SMTP Host, Port, Username, and Password.
5. Save changes and click **Send Test Email** to verify delivery.

---

## 2. Supabase Email Templates Setup

In your **Supabase Dashboard** &rarr; **Authentication** &rarr; **Email Templates**, paste each corresponding HTML template:

| Template Name | Supabase Tab | Subject Line | Source File |
| :--- | :--- | :--- | :--- |
| **Magic Link / OTP** | `Magic Link` | `Your SiksaTech Verification Code: {{ .Token }}` | [`magic-link-otp.html`](./magic-link-otp.html) |
| **Reset Password** | `Reset Password` | `Reset your SiksaTech account password` | [`reset-password.html`](./reset-password.html) |
| **Confirm Signup** | `Confirm Signup` | `Confirm your SiksaTech account` | [`confirm-signup.html`](./confirm-signup.html) |
| **Change Email** | `Change Email Address` | `Confirm change of email for SiksaTech` | [`change-email.html`](./change-email.html) |
| **Invite User** | `Invite User` | `You have been invited to SiksaTech` | [`user-invite.html`](./user-invite.html) |

---

## 3. Supported Authentication Flows in Frontend

- **OTP / Magic Code Login**: Available on `/auth/login` (tab toggle for 6-digit code).
- **Forgot Password**: Request recovery email at `/auth/forgot-password`.
- **Set New Password**: Update password securely at `/auth/reset-password`.
- **Google OAuth**: One-click authentication with persona onboarding.
